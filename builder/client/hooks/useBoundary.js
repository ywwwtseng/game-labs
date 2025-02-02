import { useEffect, useState, useRef } from 'react';
import { useWindowSize } from '@/context/WindowSizeContext';

function useBoundary() {
  const ref = useRef(null);
  const [bounds, setBounds] = useState(undefined);
  const windowSize = useWindowSize();

  useEffect(() => {
    setBounds(ref.current.getBoundingClientRect());
  }, [windowSize]);

  return { ref, bounds };
}

export { useBoundary };