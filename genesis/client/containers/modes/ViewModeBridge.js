import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { addSceneTile } from "@/features/appState/appStateSlice";
import { DragAndDropContext } from "@/context/DragAndDropContext";

function ViewModeBridge({ children }) {
  const dispatch = useDispatch();
  const { addDropzone, removeDropzone } = useContext(DragAndDropContext);

  useEffect(() => {
    const onDrop = (event, data, index) => {
      event.preventDefault();
      if (!data) return;
      const [originX, originY, sizeX, sizeY] = data.selected;

      MatrixUtil.traverse([sizeX, sizeY], (x, y) => {
        dispatch(
          addSceneTile({
            index: [index[0] + x, index[1] + y],
            tile: {
              filename: data.filename,
              index: [originX + x, originY + y],
            },
          })
        );
      });
    };

    addDropzone({
      id: "canvas",
      accept: "tiles",
      el: () => document.getElementById("canvas"),
      onDrop,
    });

    return () => {
      removeDropzone("canvas");
    };
  }, []);

  return children({ register: {}, connect: { id: "canvas" } });
}

export { ViewModeBridge };
