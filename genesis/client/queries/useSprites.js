import { useQuery } from '@/features/query';
import { fetchSprites } from '@/api';

function useSprites() {
  const { data } = useQuery({ queryKey: 'sprites', queryFn: fetchSprites });
  return data || [];
}

export { useSprites };