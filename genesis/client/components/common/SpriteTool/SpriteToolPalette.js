import { useCallback, useMemo } from "react";
import { Canvas2D, CANVAS_LAYER } from "@/components/common/Canvas2D";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { useCanvasSelectArea } from "@/hooks/useCanvasSelectArea";
import { CanvasUtil } from "@/utils/CanvasUtil";

function SpriteToolPalette({ spriteSheet, defaultSelected, onSelected }) {
  const { selected, register, connect } = useCanvasSelectArea({
    defaultSelected,
    selectedWhenMouseLeave: true,
    canvasId: `spriteSheet-${spriteSheet.source}`,
    draggable: false,
    draggedItem: {
      display: (_, data) => {
        if (!data.selected) {
          return
        }
        return CanvasUtil.drawSelected(data.selected, spriteSheet);
      },
    },
    onSelected: (selected) => {
      if (onSelected && selected.rect) {
        onSelected({
          rect: selected.rect,
          source: spriteSheet.source,
        });
      } else {
        onSelected(null);
      }
    },
  });

  const layers = useMemo(() => [
    CANVAS_LAYER.SPRITE_LAYER({
      layers: spriteSheet.tiles,
      width: spriteSheet.image.naturalWidth,
      height: spriteSheet.image.naturalHeight,
    }),
    CANVAS_LAYER.GRID({
      width: spriteSheet.image.naturalWidth,
      height: spriteSheet.image.naturalHeight,
    }),
  ], [spriteSheet.image.naturalWidth, spriteSheet.image.naturalHeight, spriteSheet.tiles]);

  const cache = useCallback((ctx) => {
    CanvasUtil.selected(ctx, selected.rect);
  }, [selected.rect]);

  return (
    <div className="px-2 pt-0.5 pb-2" {...register}>
      <Canvas2D
        id={`spriteSheet-${spriteSheet.source}`}
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
