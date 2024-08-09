import {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import { Draggable } from '@/containers/Draggable';
import { getBoundingBox } from '@/helpers/BoundingBox';

const Menu = forwardRef(
  ({ children, origin, limit = 'edit-area', ...props }, ref) => {
    const itemRef = useRef();
    const [pos, setPos] = useState(origin);
    const updatePos = useCallback((_, { delta }) => {
      setPos((pos) => {
        const limitBounds = getBoundingBox(limit);
        const bounds = getBoundingBox(itemRef.current);
        bounds.left = pos.x + delta.x;
        bounds.top = pos.y + delta.y;

        if (bounds.left <= limitBounds.left) {
          bounds.left = limitBounds.left;
        } else if (bounds.right >= limitBounds.right) {
          bounds.right = limitBounds.right;
        }

        if (bounds.top <= limitBounds.top) {
          bounds.top = limitBounds.top;
        } else if (bounds.bottom >= limitBounds.bottom) {
          bounds.bottom = limitBounds.bottom;
        }

        return {
          x: bounds.left,
          y: bounds.top,
        };
      });

      itemRef.current.style.opacity = 1;
    }, []);

    const updateMenuZIndex = useCallback(() => {
      const menus = document.getElementsByClassName('menu');

      for (let index = 0; index < menus.length; index++) {
        const menu = menus[index];

        if (menu === itemRef.current) {
          menu.style.zIndex = 31;
        } else {
          menu.style.zIndex = 30;
        }
      }
    }, []);

    useImperativeHandle(ref, () => ({
      checkPos: () => {
        itemRef.current.style.opacity = 0;
        updatePos(undefined, { delta: { x: 0, y: 0 } });
      },
    }));

    return createPortal(
      <Draggable
        handle="handle"
        onMove={updatePos}
        onMouseDown={updateMenuZIndex}>
        <div
          ref={itemRef}
          className="menu select-none absolute rounded bg-[#2B2B2B]"
          style={{ left: `${pos.x}px`, top: `${pos.y}px`, zIndex: 30 }}
          {...props}
        >
          {children}
        </div>
      </Draggable>,
      document.body,
    );
  },
);

Menu.Header = ({ children }) => (
  <div
    data-handle="handle"
    className="flex items-center px-2 py-1  bg-[#282828]"
  >
    {children}
  </div>
);

export { Menu };
