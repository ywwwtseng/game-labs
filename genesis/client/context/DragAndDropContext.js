import { createContext, useContext, useCallback, useRef, useEffect } from "react";
import { CanvasUtil } from "@/utils/CanvasUtil";

export const DragAndDropContext = createContext({
  setDragStart: () => {},
  setDragStop: () => {},
  onDrop: () => {},
  addDropzone: () => {},
  removeDropzone: () => {},
});

export const DragAndDropProvider = ({ children }) => {
  const ref = useRef(null);
  const dropzonesRef = useRef([]);

  const setDragStart = (item) => {
    ref.current = item;
  };

  const onDrop = useCallback((event) => {
    dropzonesRef.current.forEach(({ accept, el, events }) => {
      el = el();

      if (ref.current && accept.includes(ref.current.type)) {
        events?.[ref.current.type]?.(event, ref.current);
      }
    });
  }, []);


  

  const setDragStop = () => {
    ref.current = null;
  };

  const addDropzone = (dropzone) => {
    dropzonesRef.current = [...dropzonesRef.current, dropzone];
  };

  const removeDropzone = (id) => {
    dropzonesRef.current = [...dropzonesRef.current].filter((dropzone) => dropzone.id !== id);
  };

  const value = {
    setDragStart,
    setDragStop,
    onDrop,
    addDropzone,
    removeDropzone,
  };

  return (
    <DragAndDropContext.Provider value={value}>
      {children}
    </DragAndDropContext.Provider>
  );
};

export function setupDropzone({ id, accept = [], events }) {
  const { addDropzone, removeDropzone } = useContext(DragAndDropContext);

  useEffect(() => {
    addDropzone({
      id,
      accept,
      el: () => document.getElementById(id),
      events,
    });

    return () => {
      removeDropzone(id);
    };
  }, [events]);

  return {
    id,
  };
}