import { postObject2D } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateObject2D(props) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postObject2D,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['object2ds'] });
      props?.onSuccess(res);

    },
    ...props,
  });
}

export { useCreateObject2D };