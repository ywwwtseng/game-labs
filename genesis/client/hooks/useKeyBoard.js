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
export const O_KEY = 'KeyO';
export const P_KEY = 'KeyP';
export const S_KEY = 'KeyS';
export const X_KEY = 'KeyX';
export const Z_KEY = 'KeyZ';
export const META_KEY = {
  code: 'metaKey',
  isMetaKey(code) {
    return code === 'MetaLeft' || code === 'MetaRight';
  },
  with(code) {
    return `${this.code}.${code}`;
  },
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

      if (keyStatesRef.current[code] === keyState) {
        return;
      }

      if (event.metaKey) {
        if (keyStatesRef.current[META_KEY.with(code)] === keyState) {
          return;
        }
      }

      if (keyState === PRESSED) {
        if (event.metaKey) {
          keyStatesRef.current[META_KEY.with(code)] = keyState;
          inputRef.current?.[META_KEY.with(code)]?.(event);
        } else {
          keyStatesRef.current[code] = keyState;
          inputRef.current?.[code]?.(event);
        }
      } else {
        if (META_KEY.isMetaKey(code)) {
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
