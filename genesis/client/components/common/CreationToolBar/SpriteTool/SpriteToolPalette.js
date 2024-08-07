import { useCallback, useMemo } from 'react';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { useLocalSelector } from '@/hooks/useLocalSelector';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { contain } from '@/helpers/BoundingBox';

function SpriteToolPalette({ spriteSheet, defaultSelected }) {
  const canvasId = `spriteSheet-${spriteSheet.source}`;
  const { selector, register, connect } = useLocalSelector({
    defaultSelected,
    canvasId,
    selectedWhenMouseLeave: true,
    draggable: true,
    dragAndDrop: {
      data: (rect) => {
        return {
          type: 'tiles',
          rect,
          source: spriteSheet.source,
        };
      },
      beforeDrop: (_, { iconEl }) =>
        iconEl && contain(iconEl, { in: 'canvas' })
      ,
    },
    icon: {
      display: (_, { rect }) => {
        if (!rect) {
          return;
        }

        return CanvasUtil.drawSelected(rect, spriteSheet);
      },
    },
  });

  const layers = useMemo(
    () => [
      CANVAS_LAYER.SPRITE_LAYERS({
        layers: [{ tiles: spriteSheet.tiles }],
        width: spriteSheet.image.naturalWidth,
        height: spriteSheet.image.naturalHeight,
      }),
      CANVAS_LAYER.GRID({
        width: spriteSheet.image.naturalWidth,
        height: spriteSheet.image.naturalHeight,
      }),
    ],
    [
      spriteSheet.image.naturalWidth,
      spriteSheet.image.naturalHeight,
      spriteSheet.tiles,
    ],
  );

  const cache = useCallback(
    (ctx) => {
      CanvasUtil.selected(ctx, selector.rect.default);
    },
    [selector.rect.default],
  );

  return (
    <div className="px-2 pt-0.5 pb-2" {...register}>
      <Canvas2D
        id={canvasId}
        layers={layers}
        cache={cache}
        width={spriteSheet.image.naturalWidth}
        height={spriteSheet.image.naturalHeight}
        {...connect}
      />
    </div>
  );
}

export { SpriteToolPalette };
