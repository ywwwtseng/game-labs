import { useRef, useCallback, useContext } from "react";
import { DragAndDropContext } from "@/context/DragAndDropContext";
import { BoundingBox } from "@/helpers/BoundingBox";

function useDraggable({
  data,
  draggedItem,
  handle,
  onMove,
  beforeDrop = () => true,
}) {
  const dataRef = useRef(data || null);
  const draggedItemRef = useRef(null);
  const originRef = useRef(null);
  const { setDragStart, onDrop, setDragStop } = useContext(DragAndDropContext);

  const handleMouseMove = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    if (draggedItem) {
      if (!draggedItemRef.current) {
        setDragStart(dataRef.current);
        draggedItemRef.current = draggedItem.display(event, dataRef.current);
        document.body.append(draggedItemRef.current);
      }

      const bounds = new BoundingBox(draggedItemRef.current);
      draggedItemRef.current.style.userSelect = "none";
      draggedItemRef.current.style.position = "fixed";
      draggedItemRef.current.style.zIndex = 9999;
      const poistion = draggedItem.pos(event, bounds);
      draggedItemRef.current.style.left = `${poistion.x}px`;
      draggedItemRef.current.style.top = `${poistion.y}px`;
    }

    if (originRef.current) {
      const dx = event.pageX - originRef.current.x;
      const dy = event.pageY - originRef.current.y;

      originRef.current = {
        x: event.pageX,
        y: event.pageY,
      };

      if (onMove) {
        onMove({ x: dx, y: dy });
      }
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
    originRef.current = null;

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseStop);
  }, []);

  const handleMouseDown = useCallback((event) => {
    if (handle) {
      if (event.target.getAttribute("data-handle") !== handle) {
        return;
      }
    }

    originRef.current = {
      x: event.pageX,
      y: event.pageY,
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseStop);
  }, []);

  return {
    setData: (data) => (dataRef.current = data),
    handleMouseDown,
  };
}

export { useDraggable };
