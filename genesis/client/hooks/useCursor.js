import { useRef } from "react";
import { BoundingBox } from "@/helpers/BoundingBox";
import { useCursorDelta } from "@/hooks/useCursorDelta";

function useCursor({
  display,
  onStart,
  onEnd,
  onMove,
  onDownMove
}) {
  const cursorDelta = useCursorDelta();
  const isPressRef = useRef(false);
  const cursorRef = useRef(null);
  const upHandlerRef = useRef(null);
  const moveHandlerRef = useRef(null);

  const onMouseMove = (event) => {
    if (display) {
      if (!cursorRef.current) {
        cursorRef.current = display(event);
        document.body.append(cursorRef.current);
      }
  
      const bounds = new BoundingBox(cursorRef.current);
      const position = {
        x: event.pageX - bounds.size.x / 2,
        y: event.pageY - bounds.size.y / 2,
      };
      cursorRef.current.style.left = `${position.x}px`;
      cursorRef.current.style.top = `${position.y}px`;
      cursorRef.current.style.pointerEvents = "none";
      cursorRef.current.style.position = "fixed";
      cursorRef.current.style.zIndex = 9999;
    }
    
    const { delta } = cursorDelta.move(event);

    if (isPressRef.current) {
      onDownMove?.(event, delta);
    }

      onMove?.(event, delta);
  };

  const onMouseEnter = () => {
    moveHandlerRef.current = onMouseMove;
    window.addEventListener("mousemove", moveHandlerRef.current);
  };

  const onMouseLeave = () => {
    if (cursorRef.current) {
      cursorRef.current.remove();
      cursorRef.current = null;
    }

    if (moveHandlerRef.current) {
      window.removeEventListener("mousemove", moveHandlerRef.current);
      moveHandlerRef.current = null;
    }
  };

  const onMouseUp = () => {
    onEnd?.(event);
    cursorDelta.end(event);

    isPressRef.current = false;

    if (cursorRef.current) {
      cursorRef.current.remove();
      cursorRef.current = null;
    }

    if (upHandlerRef.current) {
      document.removeEventListener("mouseup", upHandlerRef.current);
    }
  };

  const onMouseDown = (event) => {
    onStart?.(event);

    isPressRef.current = true;

    cursorDelta.start(event);

    if (isPressRef.current) {
      onDownMove?.(event, null);
    }

    onMove?.(event, null);

    upHandlerRef.current = onMouseUp;
    document.addEventListener("mouseup", upHandlerRef.current);
  };

  

  return {
    setup: {
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
    }
  };
}

export { useCursor };
