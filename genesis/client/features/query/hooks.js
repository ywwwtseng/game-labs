import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getQueryFn,
  executeQuery,
  invalidateQueries,
  setRelateQueryData,
  serialize
} from '@/features/query/querySlice';
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

export function useQuery(sql) {
  const callbackData = /find\(\)/.test(sql) ? [] : undefined;
  const dispatch = useDispatch();
  const query = useSelector(state => state.query[serialize(sql)]);

  useEffect(() => {
    const queryFn = () => request(
      '/api/sql',
      { 
        method: 'POST',
        body: JSON.stringify({ sql }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
      }
    );

    dispatch(executeQuery({ queryKey: sql, queryFn }));
  }, []);

  return {
    data: query?.data || callbackData,
  };
}
