import { useEffect, createContext, useRef, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { executeQuery, setQueryData, serialize } from '@/features/query/querySlice';
import { request } from '@/request';

export const QueryClientContext = createContext({
  setQueryFn: () => {},
  getQueryFn: () => {},
});

export const QueryClientProvider = ({ children }) => {
  const queryFns = useRef(new Map());

  const setQueryFn = useCallback(({queryKey, queryFn}) => {
    queryFns.current.set(serialize(queryKey), queryFn);
  }, []);

  const getQueryFn = useCallback((queryKey) => {
    return queryFns.current.get(serialize(queryKey));
  }, []);


  return (
    <QueryClientContext.Provider value={{setQueryFn, getQueryFn}}>
      {children}
    </QueryClientContext.Provider>
  );
};

export function useQueryClient() {
  const dispatch = useDispatch();
  const { getQueryFn } = useContext(QueryClientContext);
  const invalidateQueries = useCallback(({ queryKeys }) => {
    queryKeys.map((queryKey) => [queryKey, getQueryFn(queryKey)]).forEach(([queryKey, queryFn]) => {
      dispatch(executeQuery({ queryKey, queryFn }));
    });
  }, []);

  return {
    invalidateQueries,
  }
}

export function useMutation(sql, { queryKeys = [], onSuccess } = { queryKeys: [], onSuccess: () => {} }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

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

    queryClient.invalidateQueries({ queryKeys });

    const match = sql.match(/(?<=:)[^.]+/);

    if (match) {
      dispatch(setQueryData({
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
  const { setQueryFn, getQueryFn } = useContext(QueryClientContext);
  const dispatch = useDispatch();
  const query = useSelector(state => state.query[serialize(sql)]);

  useEffect(() => {
    if (!getQueryFn(sql)) {
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

      setQueryFn({ queryKey: sql, queryFn });
      dispatch(executeQuery({ queryKey: sql, queryFn }));
    }
  }, []);

  return {
    data: query?.data || callbackData,
  };
}
