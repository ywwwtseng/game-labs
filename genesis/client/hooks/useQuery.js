import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { executeQuery, selectedQuery } from '@/features/query/querySlice';
import { request } from '@/request';

export function useQuery(sql, params, options) {
  // const callbackData = /find\(\)/.test(sql) ? [] : undefined;
  const dispatch = useDispatch();
  const query = useSelector(selectedQuery({ queryKey: sql, params }));

  useEffect(() => {
    if (sql) {
      const queryFn = () => request(
        '/api/sql',
        { 
          method: 'POST',
          body: JSON.stringify({ sql, params }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
        }
      );

      dispatch(executeQuery({ queryKey: sql, params, queryFn, force: options?.force }))
        .unwrap()
        .then((res) => {
          options?.onSuccess(res);
        });
    }   
  }, [sql, params]);

  return {
    data: query?.data,
  };
}
