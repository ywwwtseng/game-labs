import { deleteObject2DAnimFrame } from '@/api';
import { useMutation, useQueryClient } from '@/features/query/QueryClientContext';

function useDeleteObject2DAnimFrame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteObject2DAnimFrame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKeys: ['object2ds'] });
    }
  });
}

export { useDeleteObject2DAnimFrame };