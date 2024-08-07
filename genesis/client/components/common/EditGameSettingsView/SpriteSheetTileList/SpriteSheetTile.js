import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Draggable } from '@/containers/Draggable';
import { OperableItem } from '@/components/common/OperableItem';
import { contain } from '@/helpers/BoundingBox';
import { selectedIsDrawMode } from '@/features/appState/appStateSlice';

function SpriteSheetTile({ spriteSheet, index, width = 16, height = 16 }) {
  const isDrawMode = useSelector(selectedIsDrawMode);
  const ref = useRef(null);
  const transparent = spriteSheet.transparent.includes(
    `${index[0]}.${index[1]}`,
  );
  const tile = spriteSheet.tiles[index[0]][index[1]];

  const drawImage = useCallback((el) => {
    if (el.tagName !== 'CANVAS') {
      return;
    }

    const ctx = el.getContext('2d');
    ctx.drawImage(tile.buffer, 0, 0);
  }, []);

  useEffect(() => {
    if (!transparent) {
      drawImage(ref.current);
    }
  }, []);

  if (transparent) {
    return null;
  }

  return (
    <OperableItem
      className="px-1"
      label={
        <Draggable
          disabled={isDrawMode}
          data={{
            type: 'tile',
            source: spriteSheet.source,
            index,
          }}
          icon={{
            display: () => {
              const el = ref.current.cloneNode();
              drawImage(el);
              return el;
            },
          }}
          beforeDrop={(_, { iconEl }) =>
            iconEl && contain(iconEl, { in: 'canvas' })
          }
        >
          <canvas ref={ref} width={width} height={height} />
        </Draggable>
      }
    />
  );
}

export { SpriteSheetTile };
