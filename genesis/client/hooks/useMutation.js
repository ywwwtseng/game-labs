import useSWRMutation from "swr/mutation";

async function sendRequest(url, { arg }, options = {}) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    ...options,
  }).then(res => res.json());
}
 

function useMutation(url, method = "POST") {
  return useSWRMutation(url, sendRequest, { method });
}

export { useMutation };