import { postObject2D } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateObject2D() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postObject2D,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['object2ds'] });
    }
  });
}

export { useCreateObject2D };