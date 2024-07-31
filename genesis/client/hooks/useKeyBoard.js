import { useEffect, useRef, useCallback } from "react";
import { useObservableRef } from "@/hooks/useObservableRef";

export const BACKSPACE_KEY = 8;
export const TAB_KEY = 9;
export const ENTER_KEY = 13;
export const SPACE_KEY = 32;
export const ARROW_LEFT_KEY = 37;
export const ARROW_UP_KEY = 38;
export const ARROW_RIGHT_KEY = 39;
export const ARROW_DOWN_KEY = 40;
export const D_KEY = 68;
export const P_KEY = 80;
export const S_KEY = 83;

function useKeyBoard(inputMapping) {
  const inputRef = useObservableRef(inputMapping);
  const holdingKeyCodeRef = useRef({});

  const isHolding = useCallback((keyCode) => holdingKeyCodeRef.current[keyCode], []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      holdingKeyCodeRef.current[event.keyCode] = true;
      inputRef.current?.[event.keyCode]?.(event);
    };

    const handleKeyUp = (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log(event.keyCode);
      holdingKeyCodeRef.current[event.keyCode] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return {
    isHolding
  }
}

export { useKeyBoard };