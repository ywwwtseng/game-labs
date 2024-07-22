import React, { useRef, useCallback, useContext } from "react";
import { DragAndDropContext } from "@/store/DragAndDropContext";

function Draggable({ data, cloneAfter, children }) {
  const ref = useRef(null);
  const { setDragStart, setDragStop } = useContext(DragAndDropContext);

  const handleMouseMove = useCallback((event) => {
    if (!ref.current) {
      setDragStart(data);
      ref.current = cloneAfter(event.target.cloneNode());
      document.body.append(ref.current);
    }

    const bounds = ref.current.getBoundingClientRect();
    ref.current.style.userSelect = 'none';
    ref.current.style.position = 'fixed';
    ref.current.style.zIndex = 9999;
    ref.current.style.left = `${event.pageX - bounds.width / 2}px`;
    ref.current.style.top = `${event.pageY - bounds.height / 2}px`;
  }, []);

  const handleMouseStop = useCallback((event) => {
    if (ref.current) {
      ref.current.remove();
      ref.current = null;
    }
    setDragStop(event);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseStop);
  }, []);

  const handleMouseDown = useCallback(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseStop);
  }, []);

  return (
    React.cloneElement(children, {
      onMouseDown: handleMouseDown
    })
  );
}

export { Draggable };