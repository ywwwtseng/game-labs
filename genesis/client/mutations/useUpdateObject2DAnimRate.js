import { updateObject2DAnimRate } from '@/api';
import { useMutation, useQueryClient } from '@/features/query';

function useUpdateObject2DAnimRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateObject2DAnimRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKeys: ['object2ds'] });
    }
  });
}

export { useUpdateObject2DAnimRate };