import useSWR from 'swr';

function useObject2Ds() {
  const { data } = useSWR('/api/object2ds');
  return data?.list || [];
}

export { useObject2Ds };
