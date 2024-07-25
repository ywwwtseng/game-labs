import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { addSceneTile } from "@/features/appState/appStateSlice";

function useTileFill() {
  const selected = useSelector((state) => state.sceneSelectArea.selected);
  const dispatch = useDispatch();

  return useCallback(
    (tile) => {
      if (selected.index) {
        const [originX, originY, sizeX, sizeY] = selected.index;

        MatrixUtil.traverse([sizeX, sizeY], (x, y) => {
          dispatch(
            addSceneTile({
              index: [originX + x, originY + y],
              tile: {
                filename: tile.filename,
                index: tile.index,
              },
            })
          );
        });
      }
    },
    [selected.index]
  );
}

export { useTileFill };
