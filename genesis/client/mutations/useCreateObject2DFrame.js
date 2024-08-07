import { createObject2DFrame } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateObject2DFrame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createObject2DFrame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['object2ds'] });
    }
  });
}

export { useCreateObject2DFrame };