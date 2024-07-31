import { useEffect, useRef } from "react";

function useObservableRef(value) {
  const ref = useRef(value);

  useEffect(() => {
    if (ref.current !== value) {
      ref.current = value;
    }
  }, [value]);

  return ref;
}

export { useObservableRef };