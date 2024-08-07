import { enableObject2DAnim } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useEnableObject2DAnim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enableObject2DAnim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['object2ds'] });
    }
  });
}

export { useEnableObject2DAnim };