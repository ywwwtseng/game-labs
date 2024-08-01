import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setupDropzone } from "@/context/DragAndDropContext";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { draw, fill } from "@/features/appState/appStateSlice";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { overlaps } from "@/helpers/BoundingBox";

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
          dispatch(
            fill({
              selectedRect,
              tile: {
                index: data.index,
                source: data.source,
              },
            })
          );
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
