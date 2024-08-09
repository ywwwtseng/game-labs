import { postObject2D } from '@/api';
import { useMutation, useQueryClient } from '@/features/query/QueryClientContext';

function useCreateObject2D({ onSuccess }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postObject2D,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKeys: ['object2ds'] });
      onSuccess?.(res);

    },
  });
}

export { useCreateObject2D };