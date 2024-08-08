import { createObject2DFrame } from '@/api';
import { useMutation, useQueryClient } from '@/features/query';

function useCreateObject2DFrame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createObject2DFrame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKeys: ['object2ds'] });
    }
  });
}

export { useCreateObject2DFrame };