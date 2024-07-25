import { useRef, useEffect } from "react";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

function Canvas2D({
  id = "canvas",
  grid = false,
  scale = 1,
  selected,
  layers = [],
  width,
  height,
  ...props
}) {
  const ref = useRef(null);
  const lastGridLineSpacing = grid || crop ? 1 : 0;

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    
    CanvasUtil.clear(ctx, {
      width: width * scale + lastGridLineSpacing,
      height: height * scale + lastGridLineSpacing,
    });

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

    if (grid) {
      CanvasUtil.grid(ctx, { width: width * scale, height: height * scale, scale });
    }
    
    if (selected) {
      CanvasUtil.selected(ctx, selected);
    }

  }, [grid, width, height, layers, selected]);

  return (
    <canvas
      ref={ref}
      id={id}
      className="bg-[#373737]"
      width={width * scale + lastGridLineSpacing}
      height={height * scale + lastGridLineSpacing}
      {...props}
    />
  );
}

export { Canvas2D }