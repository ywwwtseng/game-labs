import { useState, useMemo } from 'react';
import { useWindowSize } from '@/context/WindowSizeContext';

function useCamera() {
  const windowSize = useWindowSize();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const size = useMemo(() => {
    return Math.floor((Math.min(windowSize.width - 220, windowSize.height - 52) - 50) / 16) * 16;
  }, [windowSize]);

  return {
    pos,
    size,
  }
}

export { useCamera };
