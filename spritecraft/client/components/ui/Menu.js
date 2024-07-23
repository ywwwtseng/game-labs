import {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
} from "react";
import { createPortal } from "react-dom";
import { Draggable } from "@/components/common/Draggable";
import { BoundingBox } from "@/helpers/BoundingBox";

const Menu = forwardRef(({ children, origin, limit = "edit-area", ...props }, ref) => {
  const itemRef = useRef();
  const [pos, setPos] = useState(origin);
  const updatePos = useCallback((delta) => {
    setPos((pos) => {
      const limitBounds = new BoundingBox(document.getElementById(limit));
      const bounds = new BoundingBox(itemRef.current);
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
  }, []);

  useImperativeHandle(ref, () => ({
    checkPos: () => {
      updatePos({x:0, y: 0});
    },
  }));

  return createPortal(
    <Draggable handle="handle" onMove={updatePos}>
      <div
        ref={itemRef}
        className="select-none absolute z-30 rounded bg-[#2B2B2B]"
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        {...props}
      >
        {children}
      </div>
    </Draggable>,
    document.body
  );
})

Menu.Header = ({ children }) => (
  <div
    data-handle="handle"
    className="flex items-center px-2 py-1  bg-[#282828]"
  >
    {children}
  </div>
);

export { Menu };
