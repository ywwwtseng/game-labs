import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setupDropzone } from "@/context/DragAndDropContext";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { draw } from "@/features/appState/appStateSlice";
import { addTileToScene } from "@/features/appState/appStateSlice";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { getBoundingBox, overlaps } from "@/helpers/BoundingBox";

function useDropToDraw({ id }) {
  const selectedRect = useSelector((state) => state.selectMode.selected.rect);

  const dispatch = useDispatch();
  const spriteSheets = useSpriteSheets();
  const events = useMemo(
    () => ({
      tile: (event, data) => {
        event.preventDefault();
        if (!data) return;

        const canvas = document.getElementById(id);
        const rect = [...data.index, 1, 1];
        
        if (
          selectedRect &&
          overlaps({ selectedArea: selectedRect, canvas }, { event, rect })
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
                rect: [...data.index, 1, 1],
                source: data.source,
              },
              transparent: spriteSheets[data.source].transparent,
            })
          );
        }
      },
      pattern: (event, data) => {
        console.log("pattern");
      },
    }),
    [spriteSheets, selectedRect]
  );

  const setup = setupDropzone({ id, accept: ["tile", "pattern"], events });

  return {
    setup,
  };
}

export { useDropToDraw };
