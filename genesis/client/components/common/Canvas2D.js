import { useRef, useEffect, useMemo } from "react";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

export const CANVAS_LAYER = {
  GRID: ({ width, height }) => ({
    name: 'GRID',
    buffer: CanvasUtil.createGridBuffer(width + 1, height + 1),
  }),
  TILES: ({ tiles, width, height }) => ({
    name: 'TILES',
    buffer: CanvasUtil.createTileBuffer(
      tiles,
      width + 1,
      height + 1,
    ),
  }),
};

function Canvas2D({
  id = "canvas",
  layers = [],
  cache,
  width,
  height,
  ...props
}) {
  
  const ref = useRef(null);
  const padding = 1;

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    CanvasUtil.clear(ctx);

    layers.forEach((layer) => {
      ctx.drawImage(
        layer.buffer,
        0,
        0
      );
    });

    if (cache) {
      cache(ctx);
    }
  }, [layers, cache]);

  return (
    <canvas
      ref={ref}
      id={id}
      className="bg-[#373737]"
      width={width + 1}
      height={height + 1}
      {...props}
    />
  );
}

export { Canvas2D }