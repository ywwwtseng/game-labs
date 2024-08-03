import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Draggable } from '@/containers/Draggable';
import { OperableItem } from '@/components/common/OperableItem';
import { CANVAS_LAYER } from '@/components/common/Canvas2D';
import { Text } from '@/components/ui/Text';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { contain } from '@/helpers/BoundingBox';
import { selectedIsDrawMode } from '@/features/appState/appStateSlice';

function SpriteSheetPattern({ spriteSheet, pattern }) {
  const isDrawMode = useSelector(selectedIsDrawMode);
  const ref = useRef(null);
  const sizeIndex = useMemo(() => {
    return MatrixUtil.sizeIndex(pattern.tiles);
  }, [pattern.tiles]);
  const size = {
    x: sizeIndex[0] > sizeIndex[1] ? 64 : (64 * sizeIndex[0]) / sizeIndex[1],
    y: sizeIndex[1] > sizeIndex[0] ? 64 : (64 * sizeIndex[1]) / sizeIndex[0],
  };

  const tiles = useMemo(() => {
    return MatrixUtil.map(pattern.tiles, ([x, y]) => {
      return spriteSheet.tiles?.[x]?.[y];
    });
  }, [pattern.tiles]);

  const buffer = useMemo(
    () =>
      CANVAS_LAYER.SPRITE_LAYER({
        layers: tiles,
        width: sizeIndex[0] * 16,
        height: sizeIndex[1] * 16,
      }).buffer,
    [sizeIndex, tiles],
  );

  const drawImage = useCallback(
    (el) => {
      const ctx = el.getContext('2d');
      ctx.drawImage(buffer, 0, 0, size.x, size.y);
    },
    [size, buffer],
  );

  useEffect(() => {
    drawImage(ref.current);
  }, [size, buffer]);

  return (
    <OperableItem
      label={
        <div className="flex items-start justify-center">
          <div className="w-16 h-16 flex items-center justify-center">
            <Draggable
              disabled={isDrawMode}
              data={{
                type: 'pattern',
                source: spriteSheet.source,
                pattern,
              }}
              icon={{
                display: () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = sizeIndex[0] * 16;
                  canvas.height = sizeIndex[1] * 16;
                  const ctx = canvas.getContext('2d');
                  ctx.drawImage(buffer, 0, 0);
                  return canvas;
                },
              }}
              beforeDrop={(_, { iconEl }) =>
                iconEl && contain(iconEl, { in: 'canvas' })
              }
              onMove={(_, { iconEl }) => {
                if (iconEl) {
                  iconEl.style.opacity = contain(iconEl, { in: 'canvas' })
                    ? 1
                    : 0.5;
                }
              }}
            >
              <canvas ref={ref} width={size.x} height={size.y} />
            </Draggable>
          </div>
          <div className="p-2">
            <Text>{pattern.name.toLocaleUpperCase()}</Text>
          </div>
        </div>
      }
    />
  );
}

export { SpriteSheetPattern };
