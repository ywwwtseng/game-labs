import React, { useContext, useEffect, useRef } from "react";
import { DragAndDropContext } from "@/store/DragAndDropContext";

function DropZone({ id, accept, onDrop, children }) {
  const ref = useRef();
  const { addDropzone, removeDropzone } = useContext(DragAndDropContext);

  useEffect(() => {
    addDropzone({ 
      id,
      accept,
      bounds: document.getElementById(id).getBoundingClientRect(),
      onDrop,
    });

    return () => {
      removeDropzone(id);
    };
  }, []);
  
  return (
    React.cloneElement(children, { id })
  );
}

export { DropZone };