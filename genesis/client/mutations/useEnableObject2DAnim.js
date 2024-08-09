import { enableObject2DAnim } from '@/api';
import { useMutation, useQueryClient } from '@/features/query/QueryClientContext';

function useEnableObject2DAnim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enableObject2DAnim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKeys: ['object2ds'] });
    }
  });
}

export { useEnableObject2DAnim };