import { useRef, useCallback, useContext, useMemo } from 'react';
import { DragAndDropContext } from '@/context/DragAndDropContext';
import { getBoundingBox } from '@/helpers/BoundingBox';
import { useDataTransfer } from '@/hooks/useDataTransfer';
import { useCursorDelta } from '@/hooks/useCursorDelta';
import { useObservableRef } from '@/hooks/useObservableRef';

function useDragAndDrop({
  data,
  icon,
  handle,
  onMove,
  onMouseDown,
  beforeDrop = () => true,
}) {
  const iconRef = useObservableRef(icon);
  const cursorDelta = useCursorDelta();
  const dataTransfer = useDataTransfer({ defaultData: data });
  const iconElRef = useRef(null);
  const { setDragStart, onDrop, setDragStop } = useContext(DragAndDropContext);

  const handleMouseMove = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    if (iconRef.current) {
      if (!iconElRef.current) {
        setDragStart(dataTransfer.getData());
        iconElRef.current = iconRef.current.display(event, dataTransfer.getData());
        document.body.append(iconElRef.current);
      }

      const bounds = getBoundingBox(iconElRef.current);
      iconElRef.current.style.pointerEvents = 'none';
      iconElRef.current.style.position = 'fixed';
      iconElRef.current.style.zIndex = 9999;
      const x = event.pageX - bounds.size.x / 2;
      const y = event.pageY - bounds.size.y / 2;
      iconElRef.current.style.left = `${x}px`;
      iconElRef.current.style.top = `${y}px`;
    }

    const { delta } = cursorDelta.move(event);

    if (delta) {
      onMove?.(event, { delta, iconEl: iconElRef.current });

      if (iconElRef.current && beforeDrop) {
        iconElRef.current.style.opacity = beforeDrop(event, { iconEl: iconElRef.current })
          ? 1
          : 0.5;
      }
      
    }
  }, []);

  const handleMouseStop = useCallback((event) => {
    if (beforeDrop(event, { iconEl: iconElRef.current })) {
      onDrop(event);
    }

    setDragStop(event);

    if (iconElRef.current) {
      iconElRef.current.remove();
      iconElRef.current = null;
    }

    cursorDelta.end(event);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseStop);
  }, []);

  const handleMouseDown = useCallback((event) => {
    onMouseDown?.(event);
    if (handle) {
      if (event.target.getAttribute('data-handle') !== handle) {
        return;
      }
    }

    cursorDelta.start(event);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseStop);
  }, []);

  return {
    dataTransfer,
    handleMouseDown,
  };
}

export { useDragAndDrop };
