import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { contain } from '@/helpers/BoundingBox';

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
    dropzonesRef.current.forEach(({ id, accept, events }) => {
      if (
        ref.current &&
        contain(event, { in: id }) &&
        accept.includes(ref.current.type)
      ) {
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
    dropzonesRef.current = [...dropzonesRef.current].filter(
      (dropzone) => dropzone.id !== id,
    );
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
