import React, { useContext, useEffect } from "react";
import { DragAndDropContext } from "@/store/DragAndDropContext";

function DropZone({ id, accept, onDrop, children }) {
  const { addDropzone, removeDropzone } = useContext(DragAndDropContext);

  useEffect(() => {
    addDropzone({
      id,
      accept,
      el: document.getElementById(id),
      onDrop,
    });

    return () => {
      removeDropzone(id);
    };
  }, []);

  return React.cloneElement(children, { id });
}

export { DropZone };
