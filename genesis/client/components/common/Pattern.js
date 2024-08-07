import { useCallback, useEffect, useMemo, useRef } from 'react';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { Draggable } from '@/containers/Draggable';
import { CANVAS_LAYER } from '@/components/common/Canvas2D';
import { Text } from '@/components/ui/Text';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { contain, overlaps } from '@/helpers/BoundingBox';
import { selectedIsDrawMode } from '@/features/appState/appStateSlice';
import { useSpriteSheets } from '@/context/SpriteSheetContext';

function Pattern({ pattern, draggable = false, className }) {
  const spriteSheets = useSpriteSheets();
  const ref = useRef(null);
  const sizeIndex = useMemo(() => {
    return MatrixUtil.sizeIndex(pattern.tiles);
  }, [pattern.tiles]);

  const size = {
    x: sizeIndex[0] > sizeIndex[1] ? 64 : (64 * sizeIndex[0]) / sizeIndex[1],
    y: sizeIndex[1] > sizeIndex[0] ? 64 : (64 * sizeIndex[1]) / sizeIndex[0],
  };

  const tiles = useMemo(() => {
    if (Object.keys(spriteSheets).length === 0) {
      return [];
    }

    return MatrixUtil.create(pattern.tiles, ({ value: tileItems }) => {
      return tileItems?.map((tile) => ({
        buffer: spriteSheets[tile.source].tiles[tile.index[0]][tile.index[1]].buffer,
      }));
    });
  }, [spriteSheets, pattern.tiles]);

  const buffer = useMemo(
    () =>
      CANVAS_LAYER.SPRITE_LAYERS({
        layers: [{ tiles }],
        width: sizeIndex[0] * 16,
        height: sizeIndex[1] * 16,
      }).buffer,
    [sizeIndex, tiles, spriteSheets, pattern.tiles],
  );

  const canDrop = useCallback(({ iconEl }) => {
    if (iconEl && contain(iconEl, { in: 'canvas' })) {
      if (draggable?.dragArea && overlaps(iconEl, draggable?.dragArea)) {
        return false;
      }

      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    ctx.drawImage(buffer, 0, 0, size.x, size.y);
  }, [buffer]);

  return (
    <div className={cx('w-16 h-16 flex items-center justify-center cursor-pointer', className)}>
      <Draggable
        disabled={!Boolean(draggable)}
        data={{
          type: 'pattern',
          pattern,
        }}
        icon={{
          display: () => {
            const canvas = document.createElement('canvas');
            canvas.width = sizeIndex[0] * 16;
            canvas.height = sizeIndex[1] * 16;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);
            return canvas;
          },
        }}
        beforeDrop={(_, { iconEl }) => {
          return canDrop({ iconEl });
        }
        }
      >
        <canvas ref={ref} width={size.x} height={size.y} />
      </Draggable>
    </div>
  );
}

export { Pattern };
