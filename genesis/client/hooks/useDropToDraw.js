import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setupDropzone } from "@/context/DragAndDropContext";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { draw } from "@/features/appState/appStateSlice";
import { addTileToScene } from "@/features/appState/appStateSlice";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

function useDropToDraw({ id }) {
  const selectedRect = useSelector((state) => state.selectMode.selected.rect);

  const dispatch = useDispatch();
  const spriteSheets = useSpriteSheets();
  const onDrop = useCallback(
    (event, data) => {
      event.preventDefault();
      if (!data) return;

      const pos = CanvasUtil.getPosition(event, document.getElementById(id));
      const index = CanvasUtil.positionToIndex(pos);

      if (
        selectedRect &&
        index[0] >= selectedRect[0] &&
        index[0] < selectedRect[0] + selectedRect[2] &&
        index[1] >= selectedRect[1] &&
        index[1] < selectedRect[1] + selectedRect[3]
      ) {
        const [originX, originY, sizeIndexX, sizeIndexY] = selectedRect;

        MatrixUtil.traverse([sizeIndexX, sizeIndexY], (x, y) => {
          dispatch(
            addTileToScene({
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
              rect: data.rect,
              source: data.source,
            },
            transparent: spriteSheets[data.source].transparent,
          })
        );
      }
    },
    [spriteSheets, selectedRect]
  );

  const setup = setupDropzone({ id, accept: "tiles", onDrop });

  return {
    setup
  };
}

export { useDropToDraw };
