import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setupDropzone } from '@/context/DragAndDropContext';
import { useSpriteSheets } from '@/features/appState/SpriteSheetContext';
import {
  drawTiles,
  fillTile,
  drawObject2D,
} from '@/features/appState/appStateSlice';
import { SELECT_MODE, selectedEditModeSelector } from '@/features/editMode/editModeSlice';
import { overlaps } from '@/helpers/BoundingBox';

function useDropToDraw({ id }) {
  const dispatch = useDispatch();
  const selector = useSelector(selectedEditModeSelector);
  const spriteSheets = useSpriteSheets();
  const events = useMemo(
    () => ({
      tile: (event, data) => {
        if (!data) return;

        const rect = [...data.index, 1, 1];

        if (
          selector.mode !== SELECT_MODE.OBJECT_2D &&
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
      tiles: (event, data) => {
        if (!data) return;

        if (data.rect[2] === 1 && data.rect[3] === 1) {
          if ( selector.mode !== SELECT_MODE.OBJECT_2D &&
            selector.rect.default && selector.rect.follows.length === 0 &&
            overlaps({ rect: selector.rect.default, with: id }, { event, rect: data.rect })
          ) {
            dispatch(
              fillTile({
                selectedRect: selector.rect.default,
                tile: {
                  index: [data.rect[0], data.rect[1]],
                  source: data.source,
                },
              }),
            );

            return;
          }
        }

        dispatch(
          drawTiles({
            event,
            selectedTiles: {
              rect: data.rect,
              source: data.source,
            },
            transparent: spriteSheets[data.source].transparent,
          }),
        );

      },
      object2d: (event, data) => {
        if (!data) return;
        dispatch(
          drawObject2D({
            event,
            object2d: data.object2d,
          }),
        );
      },
    }),
    [spriteSheets, selector.rect.default],
  );

  const setup = setupDropzone({ id, accept: Object.keys(events), events });

  return {
    setup,
  };
}

export { useDropToDraw };
