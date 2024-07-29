import { useRef, useCallback, useContext, useMemo } from "react";
import { DragAndDropContext } from "@/context/DragAndDropContext";
import { BoundingBox } from "@/helpers/BoundingBox";
import { useDataTransfer } from "@/hooks/useDataTransfer";
import { useCursorDelta } from "@/hooks/useCursorDelta";

function useDragAndDrop({
  data,
  draggedItem,
  handle,
  onMove,
  beforeDrop = () => true,
}) {
  const cursorDelta = useCursorDelta();
  const dataTransfer = useDataTransfer({ defaultData: data });
  const draggedItemRef = useRef(null);
  const { setDragStart, onDrop, setDragStop } = useContext(DragAndDropContext);


  const handleMouseMove = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    if (draggedItem) {
      if (!draggedItemRef.current) {
        setDragStart(dataTransfer.getData());
        draggedItemRef.current = draggedItem.display(event, dataTransfer.getData());
        document.body.append(draggedItemRef.current);
      }

      const bounds = new BoundingBox(draggedItemRef.current);
      draggedItemRef.current.style.pointerEvents = "none";
      draggedItemRef.current.style.position = "fixed";
      draggedItemRef.current.style.zIndex = 9999;
      const position = draggedItem.pos(event, bounds);
      draggedItemRef.current.style.left = `${position.x}px`;
      draggedItemRef.current.style.top = `${position.y}px`;
    }

    const { delta } = cursorDelta.move(event);

    if (delta) {
      onMove?.(delta);
    }
  }, []);

  const handleMouseStop = useCallback((event) => {
    if (beforeDrop(event, draggedItemRef.current)) {
      onDrop(event);
    }

    
    setDragStop(event);

    if (draggedItemRef.current) {
      draggedItemRef.current.remove();
      draggedItemRef.current = null;
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
