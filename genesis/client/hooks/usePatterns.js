import useSWR from 'swr';

function usePatterns() {
  const { data } = useSWR('/api/patterns');
  return data?.list || [];
}

export { usePatterns };
