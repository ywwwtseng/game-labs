import { useCallback, useMemo } from "react";
import { Canvas2D, CANVAS_LAYER } from "@/components/common/Canvas2D";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { useCanvasSelectArea } from "@/hooks/useCanvasSelectArea";
import { CanvasUtil } from "@/utils/CanvasUtil";

function SpriteToolPalette({ spriteSheet, defaultSelected, onSelected }) {
  const tiles = useMemo(() => [{ tiles: spriteSheet.tiles }], [spriteSheet.tiles]);
  const { selected, register, connect } = useCanvasSelectArea({
    defaultSelected,
    canvasId: `spriteSheet-${spriteSheet.source}`,
    source: spriteSheet.source,
    draggable: false,
    draggedItem: {
      display: (_, data) => {
        return MatrixUtil.drawSelected(data.selected, spriteSheet);
      },
      pos: (event, bounds) => ({
        x: event.pageX - bounds.size.x / 2,
        y: event.pageY - bounds.size.y / 2,
      }),
    },
    onSelected: (selected) => {
      if (onSelected && selected.index) {
        onSelected({
          index: selected.index,
          source: spriteSheet.source,
        });
      }
    },
  });

  const layers = useMemo(() => [
    CANVAS_LAYER.TILES({
      tiles,
      width: spriteSheet.image.naturalWidth,
      height: spriteSheet.image.naturalHeight,
    }),
    CANVAS_LAYER.GRID({
      width: spriteSheet.image.naturalWidth,
      height: spriteSheet.image.naturalHeight,
    }),
  ], [spriteSheet.image.naturalWidth, spriteSheet.image.naturalHeight, tiles]);

  const cache = useCallback((ctx) => {
    CanvasUtil.selected(ctx, selected.index);
  }, [selected.index]);

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
