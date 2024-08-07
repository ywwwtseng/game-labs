import useSWR from 'swr';

function useObject2Ds() {
  const { data } = useSWR('/api/object2ds', undefined);
  return data?.list || [];
}

export { useObject2Ds };
