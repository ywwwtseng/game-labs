import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setupDropzone } from '@/context/DragAndDropContext';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import {
  drawTiles,
  fillTile,
  drawPattern,
} from '@/features/appState/appStateSlice';
import { selectedSelectModeSeletorRect } from '@/features/selectMode/selectModeSlice';
import { overlaps } from '@/helpers/BoundingBox';

function useDropToDraw({ id }) {
  const selectorRect = useSelector(selectedSelectModeSeletorRect);

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
          selectorRect.default &&
          overlaps({ rect: selectorRect.default, canvas }, { event, rect })
        ) {
          dispatch(
            fillTile({
              selectedRect: selectorRect.default,
              tile: {
                index: data.index,
                source: data.source,
              },
            }),
          );
        } else {
          dispatch(
            drawTiles({
              event,
              selectedTiles: {
                rect,
                source: data.source,
              },
              transparent: spriteSheets[data.source].transparent,
            }),
          );
        }
      },
      pattern: (event, data) => {
        dispatch(
          drawPattern({
            event,
            pattern: data.pattern,
          }),
        );
      },
    }),
    [spriteSheets, selectorRect.default],
  );

  const setup = setupDropzone({ id, accept: ['tile', 'pattern'], events });

  return {
    setup,
  };
}

export { useDropToDraw };
