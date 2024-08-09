import { useEffect, createContext, useRef, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useObservableRef } from '@/hooks/useObservableRef';
import { executeQuery, serialize } from '@/features/query/querySlice';

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

export function useQuery({ queryKey, queryFn }) {
  const { setQueryFn } = useContext(QueryClientContext);
  const dispatch = useDispatch();
  const query = useSelector(state => state.query[serialize(queryKey)]);

  useEffect(() => {
    setQueryFn({ queryKey, queryFn });
    dispatch(executeQuery({ queryKey, queryFn }));
  }, []);

  return {
    data: query?.data,
  };
}

export function useMutation({ mutationFn, onSuccess }) {
  const mutate = useCallback((data) => {
    return mutationFn(data).then(onSuccess);
  }, []);

  return {
    mutate,
  }
}

export function useQueryClient() {
  const dispatch = useDispatch();
  const { getQueryFn } = useContext(QueryClientContext);
  const invalidateQueries = useCallback(({ queryKeys }) => {

    queryKeys.map((queryKey) => [queryKey, getQueryFn(queryKey)]).forEach(([queryKey, queryFn]) => {
      dispatch(query({ queryKey, queryFn }));
    });
  }, []);

  return {
    invalidateQueries,
  }
}