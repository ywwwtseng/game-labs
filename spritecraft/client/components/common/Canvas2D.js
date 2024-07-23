import { useContext, useRef, useEffect } from "react";
import { DropZone } from "@/components/common/DropZone";
import { AppContext } from "@/store/AppContext";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

function Canvas2D({
  id = "canvas",
  grid = true,
  accept = "tile",
  scale = 1,
  selected,
  tiles = [],
  width,
  height,
  onDrop,
  onMouseMove,
  onMouseLeave,
}) {
  const { state } = useContext(AppContext);
  const ref = useRef(null);
  const lastGridLineSpacing = grid ? 1 : 0;

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    
    CanvasUtil.clear(ctx, {
      width: width * scale + lastGridLineSpacing,
      height: height * scale + lastGridLineSpacing,
    });
    
    if (grid) {
      CanvasUtil.grid(ctx, { width: width * scale, height: height * scale, scale });
    }

    MatrixUtil.forEach(tiles, (tile, x, y) => {
      ctx.drawImage(
        state.spriteSheets[tile.filename].image,
        tile.index[0] * 16,
        tile.index[1] * 16,
        16,
        16,
        x * 16,
        y * 16,
        16,
        16
      );
    });
    
    if (selected) {
      CanvasUtil.selected(ctx, selected);
    }

  }, [grid, width, height, tiles, selected, state.spriteSheets]);

  return (
    <DropZone id="canvas" accept="tile" onDrop={onDrop}>
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