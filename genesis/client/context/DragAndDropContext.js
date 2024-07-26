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
    dropzonesRef.current.forEach(({ accept, el, onDrop }) => {
      el = el();

      if (ref.current && accept === ref.current.type) {
        const sizeX = ref.current.selected[2] * 16;
        const sizeY = ref.current.selected[3] * 16;

        const leftTopPos = CanvasUtil.getPosition(event, el, {
          x: -(sizeX / 2),
          y: -(sizeY / 2),
        }, 16);

        const rightBottomPos = CanvasUtil.getPosition(event, el, {
          x: (sizeX / 2) - 8,
          y: (sizeY / 2) - 8,
        });

        if (leftTopPos.within && rightBottomPos.within && onDrop) {
          onDrop(event, ref.current, CanvasUtil.positionToIndex(leftTopPos));
        }
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

export function setupDropzone({ id, accept = "tiles", onDrop }) {
  const { addDropzone, removeDropzone } = useContext(DragAndDropContext);

  useEffect(() => {
    addDropzone({
      id,
      accept,
      el: () => document.getElementById(id),
      onDrop,
    });

    return () => {
      removeDropzone(id);
    };

    return {
      id,
    };
  }, []);
}