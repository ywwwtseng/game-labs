import { postSprite } from '@/api';
import { useMutation, useQueryClient } from '@/features/query/QueryClientContext';

function useCreateSprite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postSprite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKeys: ['sprites'] });
    }
  });
}

export { useCreateSprite };