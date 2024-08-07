import { useQuery } from '@tanstack/react-query';
import { fetchSprites } from '@/api';

function useSprites() {
  const { data } = useQuery({ queryKey: ['sprites'], queryFn: fetchSprites });
  return data?.list || [];
}

export { useSprites };