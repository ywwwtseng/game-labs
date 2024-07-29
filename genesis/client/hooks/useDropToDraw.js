import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setupDropzone } from "@/context/DragAndDropContext";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { draw } from "@/features/appState/appStateSlice";
import { addSceneTile } from "@/features/appState/appStateSlice";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

function setupDropToDraw({ id }) {
  const selectedIndex = useSelector((state) => state.selectMode.selected.index);

  const dispatch = useDispatch();
  const spriteSheets = useSpriteSheets();
  const onDrop = useCallback(
    (event, data) => {
      event.preventDefault();
      if (!data) return;

      const pos = CanvasUtil.getPosition(event, document.getElementById(id));
      const index = CanvasUtil.positionToIndex(pos);

      if (
        selectedIndex &&
        index[0] >= selectedIndex[0] &&
        index[0] < selectedIndex[0] + selectedIndex[2] &&
        index[1] >= selectedIndex[1] &&
        index[1] < selectedIndex[1] + selectedIndex[3]
      ) {
        const [originX, originY, sizeIndexX, sizeIndexY] = selectedIndex;

        MatrixUtil.traverse([sizeIndexX, sizeIndexY], (x, y) => {
          dispatch(
            addSceneTile({
              index: [originX + x, originY + y],
              tile: {
                index: data.index,
                source: data.source,
              },
            })
          );
        });
      } else {
        dispatch(
          draw({
            event,
            selected: {
              index: data.index,
              source: data.source,
            },
            transparent: spriteSheets[data.source].transparent,
          })
        );
      }
    },
    [spriteSheets, selectedIndex]
  );

  const setup = setupDropzone({ id, accept: "tiles", onDrop });

  return setup;
}

export { setupDropToDraw };
