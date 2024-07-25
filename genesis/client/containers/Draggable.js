import React from "react";
import { useDraggable } from '@/hooks/useDraggable';

function Draggable({ data, draggedItem, handle, onMove, children }) {
  const { handleMouseDown } = useDraggable({ data, draggedItem, handle, onMove });

  return (
    React.cloneElement(children, {
      onMouseDown: handleMouseDown
    })
  );
}

export { Draggable };