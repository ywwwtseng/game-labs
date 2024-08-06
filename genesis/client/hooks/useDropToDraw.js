import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setupDropzone } from '@/context/DragAndDropContext';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import {
  drawTiles,
  fillTile,
  drawPattern,
} from '@/features/appState/appStateSlice';
import { SELECT_MODE, selectedSelectModeSelector } from '@/features/selectMode/selectModeSlice';
import { overlaps } from '@/helpers/BoundingBox';

function useDropToDraw({ id }) {
  const dispatch = useDispatch();
  const selector = useSelector(selectedSelectModeSelector);
  const spriteSheets = useSpriteSheets();
  const events = useMemo(
    () => ({
      tile: (event, data) => {
        event.preventDefault();
        if (!data) return;

        const rect = [...data.index, 1, 1];

        if (
          selector.mode !== SELECT_MODE.PATTERN &&
          selector.rect.default && selector.rect.follows.length === 0 &&
          overlaps({ rect: selector.rect.default, with: id }, { event, rect })
        ) {
          dispatch(
            fillTile({
              selectedRect: selector.rect.default,
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
    [spriteSheets, selector.rect.default],
  );

  const setup = setupDropzone({ id, accept: ['tile', 'pattern'], events });

  return {
    setup,
  };
}

export { useDropToDraw };
