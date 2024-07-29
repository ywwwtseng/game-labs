import React from "react";
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

function Draggable({ data, draggedItem, handle, onMove, children }) {
  const { handleMouseDown } = useDragAndDrop({ data, draggedItem, handle, onMove });

  return (
    React.cloneElement(children, {
      onMouseDown: handleMouseDown
    })
  );
}

export { Draggable };