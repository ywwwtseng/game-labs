import { postSprite } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateSprite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postSprite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprites'] });
    }
  });
}

export { useCreateSprite };