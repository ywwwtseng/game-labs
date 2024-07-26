import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { addSceneTile } from "@/features/appState/appStateSlice";

function useTileFill() {
  const selected = useSelector((state) => state.selectMode.selected);
  const dispatch = useDispatch();

  return useCallback(
    (tile) => {
      if (selected.index) {
        const [originX, originY, sizeIndexX, sizeIndexY] = selected.index;

        MatrixUtil.traverse([sizeIndexX, sizeIndexY], (x, y) => {
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
