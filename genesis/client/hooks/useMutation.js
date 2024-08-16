import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { invalidateQueries, setRelateQueryData } from '@/features/query/querySlice';
import { request } from '@/request';

export function useMutation(sql, { queryKeys = [], onSuccess } = { queryKeys: [], onSuccess: () => {} }) {
  const dispatch = useDispatch();

  const mutate = useCallback(async ({ params, data, formData }) => {
    const headers = {};
    
    if (formData instanceof FormData) {
      formData.append('sql', sql);
    } else {
      headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    const res = await request(
      formData instanceof FormData ? '/api/sql-formdata' : '/api/sql',
      { 
        method: 'POST',
        body: formData instanceof FormData
          ? formData
          : JSON.stringify({ sql, params, data }),
        headers
      }
    );

    if (onSuccess) {
      onSuccess(res);
    }

    dispatch(invalidateQueries({ queryKeys }));

    const match = sql.match(/(?<=:)[^.]+/);

    if (match) {
      dispatch(setRelateQueryData({
        relateQueryKey: match[0],
        data: res?.data
      }));
    }
    
  }, []);

  return {
    mutate,
  }
}
