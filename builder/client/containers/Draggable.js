import React from 'react';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

function Draggable({
  disabled,
  data,
  icon,
  handle,
  children,
  onMove,
  onMouseDown,
  beforeDrop,
}) {
  const { handleMouseDown } = useDragAndDrop({
    data,
    icon,
    handle,
    onMove,
    onMouseDown,
    beforeDrop,
  });

  if (disabled) {
    return children;
  }

  return React.cloneElement(children, {
    onMouseDown: handleMouseDown,
  });
}

export { Draggable };
