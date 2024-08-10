const request = (resource, options = {}) => fetch(resource, options).then((res) => res.json());

export { request };


