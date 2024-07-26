import { useContext, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { addSceneTile } from "@/features/appState/appStateSlice";
import { setupDropzone } from "@/context/DragAndDropContext";

function EditModeBridge({ children }) {
  const dispatch = useDispatch();
  const onDrop = useCallback((event, data, index) => {
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
  }, []);

  const setup = setupDropzone({ id: "canvas", accept: "tiles", onDrop });

  return children({ register: {}, connect: setup });
}

export { EditModeBridge };
