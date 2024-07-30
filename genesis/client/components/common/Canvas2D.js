import { useRef, useEffect, useMemo } from "react";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

function Canvas2D({
  id = "canvas",
  grid = false,
  tiles = [],
  cache,
  width,
  height,
  ...props
}) {
  const ref = useRef(null);
  const padding = grid ? 1 : 0;

  const tileBuffer = useMemo(() => CanvasUtil.createTileBuffer(
    tiles,
    width + padding,
    height + padding,
  ), [tiles, width, height, padding]);

  const gridBuffer = useMemo(() => {
    if (!grid) {
      return null;
    }

    return CanvasUtil.createGridBuffer(width + padding, height + padding);
  }, [grid, width, height, padding]);

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    CanvasUtil.clear(ctx);

    if (tileBuffer) {
      ctx.drawImage(tileBuffer, 0, 0);
    }

    if (gridBuffer) {
      ctx.drawImage(gridBuffer, 0, 0);
    }
    
    if (cache) {
      cache(ctx);
    }


  }, [gridBuffer, tileBuffer, cache]);

  return (
    <canvas
      ref={ref}
      id={id}
      className="bg-[#373737]"
      width={width + padding}
      height={height + padding}
      {...props}
    />
  );
}

export { Canvas2D }