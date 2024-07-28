import { useMemo } from 'react';
import { Canvas2D } from "@/components/common/Canvas2D";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { useCanvasSelectArea } from "@/hooks/useCanvasSelectArea";

function SpritePaletteToolMain({ spriteSheet, onSelected }) {
  const layers = useMemo(() => [{ tiles: spriteSheet.tiles }], [spriteSheet.tiles]);
  const { selected, register, connect } = useCanvasSelectArea({
    canvasId: `spriteSheet-${spriteSheet.path}`,
    path: spriteSheet.path,
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
          path: spriteSheet.path,
        });
      }
    },
  });

  return (
    <div className="px-2 pt-0.5 pb-2" {...register}>
      <Canvas2D
        grid
        id={`spriteSheet-${spriteSheet.path}`}
        scale={1}
        selected={selected.index}
        width={spriteSheet.image.naturalWidth}
        height={spriteSheet.image.naturalHeight}
        layers={layers}
        {...connect}
      />
    </div>
  );
}

export { SpritePaletteToolMain };
