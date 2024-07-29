import { useEffect, useRef } from "react";

function useKeyBoard(inputMapping) {
  const inputRef = useRef({});

  useEffect(() => {
    inputRef.current = inputMapping;
  }, [inputMapping]);

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