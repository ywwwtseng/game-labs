import { useRef } from "react";
import { BoundingBox } from "@/helpers/BoundingBox";

function useCursor({ display, start, end, move, downmove }) {
  const downRef = useRef(false);
  const cursorRef = useRef(null);
  const upHandlerRef = useRef(null);
  const moveHandlerRef = useRef(null);

  const onMouseMove = (event) => {
    if (!cursorRef.current && display) {
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

    if (downRef.current && downmove) {
      downmove(event);
    }

    if (move) {
      move(event);
    }
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
    if (end) {
      end(event);
    }

    downRef.current = false;

    if (cursorRef.current) {
      cursorRef.current.remove();
      cursorRef.current = null;
    }

    if (upHandlerRef.current) {
      document.removeEventListener("mouseup", upHandlerRef.current);
    }
  };

  const onMouseDown = (event) => {
    if (start) {
      start(event);
    }

    downRef.current = true;

    if (downRef.current) {
      if (downmove) {
        downmove(event);
      }
    }

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
