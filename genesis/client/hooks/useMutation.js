import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

async function sendRequest(url, { arg }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  }).then((res) => res.json());
}

function useMutation(url, queryKeys = []) {
  const { mutate } = useSWRConfig();
  return useSWRMutation(url, sendRequest, {
    onSuccess: () => {
      queryKeys.forEach((queryKey) => {
        mutate(queryKey, undefined, {
          keepPreviousData: true
        });
      });
    },
  });
}

export { useMutation };
