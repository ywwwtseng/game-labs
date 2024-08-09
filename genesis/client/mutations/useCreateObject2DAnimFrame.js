import { createObject2DAnimFrame } from '@/api';
import { useMutation, useQueryClient } from '@/features/query';

function useCreateObject2DAnimFrame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createObject2DAnimFrame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKeys: ['object2ds'] });
    }
  });
}

export { useCreateObject2DAnimFrame };