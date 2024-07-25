import { useMemo } from 'react';
import { Canvas2D } from "@/components/common/Canvas2D";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { useCanvasSelectArea } from "@/hooks/useCanvasSelectArea";

function SpritePaletteToolMain({ spriteSheet }) {
  const layers = useMemo(() => [{ tiles: spriteSheet.tiles }], [spriteSheet.tiles]);
  const { selected, register, connect } = useCanvasSelectArea({
    canvasId: `spriteSheet-${spriteSheet.filename}`,
    filename: spriteSheet.filename,
    draggable: true,
    draggedItem: {
      display: (_, data) => {
        const canvas = document.createElement("canvas");
        canvas.width = data.selected[2] * 16;
        canvas.height = data.selected[3] * 16;
        const ctx = canvas.getContext("2d");
        // ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        const [originX, originY, sizeX, sizeY] = data.selected;

        MatrixUtil.traverse([sizeX, sizeY], (x, y) => {
          ctx.drawImage(
            spriteSheet.tiles[originX + x][originY + y].buffer,
            0,
            0,
            16,
            16,
            x * 16,
            y * 16,
            16,
            16
          );
        });

        return canvas;
      },
      pos: (event, bounds) => ({
        x: event.pageX - bounds.size.x / 2,
        y: event.pageY - bounds.size.y / 2,
      }),
    },
  });

  return (
    <div className="px-2 pt-0.5 pb-2" {...register}>
      <Canvas2D
        grid
        id={`spriteSheet-${spriteSheet.filename}`}
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
