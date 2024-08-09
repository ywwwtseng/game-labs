import { getBoundingBox } from '@/helpers/BoundingBox';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export const WindowSizeContext = createContext({
  windowSize: { width: window.innerWidth, height: window.innerHeight }
});

export const WindowSizeProvider = ({ children }) => {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const updateWindowSize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  return (
    <WindowSizeContext.Provider value={{windowSize}}>
      {children}
    </WindowSizeContext.Provider>
  );
};

export function useWindowSize() {
  const { windowSize } = useContext(WindowSizeContext);
  return windowSize;
}