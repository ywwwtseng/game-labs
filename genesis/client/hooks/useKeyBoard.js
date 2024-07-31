import { useEffect, useRef } from "react";
import { useObservableRef } from "@/hooks/useObservableRef";

function useKeyBoard(inputMapping) {
  const inputRef = useObservableRef(inputMapping);

  useEffect(() => {
    const handlePress = (event) => {
      inputRef.current?.[event.key]?.(event);
    };
    window.addEventListener("keydown", handlePress);

    return () => {
      window.removeEventListener("keydown", handlePress);
    };
  }, []);
}

export { useKeyBoard };