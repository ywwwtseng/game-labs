import { disableObject2DAnim } from '@/api';
import { useMutation, useQueryClient } from '@/features/query/QueryClientContext';

function useDisableObject2DAnim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disableObject2DAnim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKeys: ['object2ds'] });
    }
  });
}

export { useDisableObject2DAnim };