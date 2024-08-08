import { useQuery } from '@/features/query';
import { fetchObject2Ds } from '@/api';

function useObject2Ds() {
  const { data } = useQuery({ queryKey: 'object2ds', queryFn: fetchObject2Ds });
  return data || [];
}

export { useObject2Ds };
