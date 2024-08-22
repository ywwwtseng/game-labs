import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useObservableRef } from '@/hooks/useObservableRef';
import { EventUtil } from '@/utils/EventUtil';

const PRESSED = 1;
const RELEASED = 0;

export const BACKSPACE_KEY = 'Backspace';
export const TAB_KEY = 'Tab';
export const ENTER_KEY = 'Enter';
export const SPACE_KEY = 'Space';
export const ARROW_LEFT_KEY = 'ArrowLeft';
export const ARROW_UP_KEY = 'ArrowUp';
export const ARROW_RIGHT_KEY = 'ArrowRight';
export const ARROW_DOWN_KEY = 'ArrowDown';
export const D_KEY = 'KeyD';
export const E_KEY = 'KeyE';
export const F_KEY = 'KeyF';
export const M_KEY = 'KeyM';
export const O_KEY = 'KeyO';
export const P_KEY = 'KeyP';
export const S_KEY = 'KeyS';
export const X_KEY = 'KeyX';
export const Z_KEY = 'KeyZ';
export const META_KEY = {
  code: 'metaKey',
  isMetaKey(event) {
    return event.code === 'MetaLeft' || event.code === 'MetaRight';
  },
  with(code) {
    return `${this.code}.${code}`;
  },
};
export const MEAT_SHIFT_KEY = {
  code: 'metaKey.shiftKey',
  with(code) {
    return `${this.code}.${code}`;
  }
};

function useKeyBoard(inputMapping, dependency = []) {
  const inputRef = useObservableRef(useMemo(() => inputMapping), dependency);
  const keyStatesRef = useRef({});

  const isPressed = useCallback(
    (code) => Boolean(keyStatesRef.current[code] === PRESSED),
    [],
  );

  useEffect(() => {
    const handleEvent = (event) => {
      EventUtil.stop(event);

      const { code } = event;

      const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

      let key = code;

      if (event.metaKey && event.shiftKey) {
        key = MEAT_SHIFT_KEY.with(code);
      } else if (event.metaKey) {
        key = META_KEY.with(code);
      }

      if (
        keyStatesRef.current[key] === keyState
        && !key.includes(META_KEY.code)
        && !key.includes(MEAT_SHIFT_KEY.code)
      ) {
        return;
      }

      if (keyState === PRESSED) {
        keyStatesRef.current[key] = keyState;
        inputRef.current?.[key]?.(event);
      } else {
        if (META_KEY.isMetaKey(event)) {
          Object.keys(keyStatesRef.current).filter((key) => key.includes(META_KEY.code)).forEach((key) => {
            delete keyStatesRef.current[key];
          });
        }

        if (keyStatesRef.current[code]) {
          delete keyStatesRef.current[code];
        }
      }
    };

    ['keydown', 'keyup'].forEach((eventName) => {
      window.addEventListener(eventName, (event) => {
        handleEvent(event);
      });
    });
  }, []);

  return {
    isPressed,
  };
}

export { useKeyBoard };
