import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { executeQuery, serialize } from '@/features/query/querySlice';
import { request } from '@/request';

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
