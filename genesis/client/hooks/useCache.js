import { useRef } from 'react';

function useCache(cache) {
  const cacheRef = useRef(cache);
  return cacheRef.current;
}

export { useCache };
