import { useRef, useEffect } from "react";
import { DropZone } from "@/components/common/DropZone";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

function Canvas2D({
  id = "canvas",
  grid = false,
  crop = false,
  accept = null,
  scale = 1,
  selected,
  layers = [],
  width,
  height,
  onDrop,
  onMouseMove,
  onMouseLeave,
}) {
  const ref = useRef(null);
  const lastGridLineSpacing = grid || crop ? 1 : 0;

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    
    CanvasUtil.clear(ctx, {
      width: width * scale + lastGridLineSpacing,
      height: height * scale + lastGridLineSpacing,
    });
    
    if (grid) {
      CanvasUtil.grid(ctx, { width: width * scale, height: height * scale, scale });
    }

    layers.forEach((layer) => {
      MatrixUtil.forEach(layer.tiles, (tile, x, y) => {
        ctx.drawImage(
          tile.buffer,
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
    });

    

    if (crop) {
      CanvasUtil.grid(ctx, { width: width * scale, height: height * scale, scale });
    }
    
    
    if (selected) {
      CanvasUtil.selected(ctx, selected);
    }

  }, [grid, width, height, layers, selected]);

  return (
    <DropZone id={id} accept={accept} onDrop={onDrop}>
      <canvas
        ref={ref}
        className="bg-[#373737]"
        width={width * scale + lastGridLineSpacing}
        height={height * scale + lastGridLineSpacing}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
    </DropZone>
  );
}

export { Canvas2D }