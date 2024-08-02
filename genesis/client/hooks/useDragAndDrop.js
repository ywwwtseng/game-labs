import { useRef, useCallback, useContext, useMemo } from "react";
import { DragAndDropContext } from "@/context/DragAndDropContext";
import { getBoundingBox } from "@/helpers/BoundingBox";
import { useDataTransfer } from "@/hooks/useDataTransfer";
import { useCursorDelta } from "@/hooks/useCursorDelta";

function useDragAndDrop({
  data,
  icon,
  handle,
  onMove,
  beforeDrop = () => true,
}) {
  const cursorDelta = useCursorDelta();
  const dataTransfer = useDataTransfer({ defaultData: data });
  const iconRef = useRef(null);
  const { setDragStart, onDrop, setDragStop } = useContext(DragAndDropContext);

  const handleMouseMove = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    if (icon) {
      if (!iconRef.current) {
        setDragStart(dataTransfer.getData());
        iconRef.current = icon.display(event, dataTransfer.getData());
        document.body.append(iconRef.current);
      }

      const bounds = getBoundingBox(iconRef.current);
      iconRef.current.style.pointerEvents = "none";
      iconRef.current.style.position = "fixed";
      iconRef.current.style.zIndex = 9999;
      const x = event.pageX - bounds.size.x / 2;
      const y = event.pageY - bounds.size.y / 2;
      iconRef.current.style.left = `${x}px`;
      iconRef.current.style.top = `${y}px`;
    }

    const { delta } = cursorDelta.move(event);

    if (delta) {
      onMove?.(event, { delta, iconEl: iconRef.current });
    }
  }, []);

  const handleMouseStop = useCallback((event) => {
    if (beforeDrop(event, { iconEl: iconRef.current })) {
      onDrop(event);
    }

    
    setDragStop(event);

    if (iconRef.current) {
      iconRef.current.remove();
      iconRef.current = null;
    }

    cursorDelta.end(event);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseStop);
  }, []);

  const handleMouseDown = useCallback((event) => {
    if (handle) {
      if (event.target.getAttribute("data-handle") !== handle) {
        return;
      }
    }

    cursorDelta.start(event);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseStop);
  }, []);

  return {
    dataTransfer,
    handleMouseDown,
  };
}

export { useDragAndDrop };
