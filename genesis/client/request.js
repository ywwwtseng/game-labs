const request = (resource, options = {}) => fetch(resource, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  ...options
}).then((res) => res.json());

export { request };


