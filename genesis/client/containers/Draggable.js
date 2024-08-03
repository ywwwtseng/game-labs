import React from 'react';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

function Draggable({
  disabled,
  data,
  icon,
  handle,
  onMove,
  children,
  beforeDrop,
}) {
  const { handleMouseDown } = useDragAndDrop({
    data,
    icon,
    handle,
    onMove,
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
