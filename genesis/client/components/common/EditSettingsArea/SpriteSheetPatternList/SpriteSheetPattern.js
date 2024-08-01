import { useCallback, useEffect, useMemo, useRef } from "react";
import { Draggable } from "@/containers/Draggable";
import { OperableItem } from "@/components/common/OperableItem";
import { Canvas2D, CANVAS_LAYER } from "@/components/common/Canvas2D";
import { Text } from "@/components/ui/Text";
import { MatrixUtil } from "@/utils/MatrixUtil";

function SpriteSheetPattern({ spriteSheet, pattern }) {
  const ref = useRef(null);
  const { source } = spriteSheet;
  const sizeIndex = useMemo(() => MatrixUtil.size(pattern.tiles), [pattern.tiles]);
  const size = {
    x: sizeIndex[0] > sizeIndex[1] ? 64 : 64 * sizeIndex[0] / sizeIndex[1],
    y: sizeIndex[1] > sizeIndex[0] ? 64 : 64 * sizeIndex[1] / sizeIndex[0]
  };

  const tiles = useMemo(() => {
    return MatrixUtil.map(pattern.tiles, ([x, y]) => {
      return spriteSheet.tiles?.[x]?.[y];
    })
  }, [pattern.tiles]);

  const buffer = useMemo(() => (
    CANVAS_LAYER.TILES({
      tiles,
      width: sizeIndex[0] * 16,
      height: sizeIndex[1] * 16,
    }).buffer
  ), [sizeIndex, tiles]);

  const drawImage = useCallback((el) => {
    const ctx = el.getContext("2d");
    ctx.drawImage(
      buffer,
      0,
      0, 
      size.x,
      size.y
    );
  }, [size, buffer]);

  useEffect(() => {
    drawImage(ref.current);
  }, [size, buffer]);

  return (
    <OperableItem
      label={
        
        <div className="flex items-start justify-center">
          <div className="w-16 h-16 flex items-center justify-center">
            <Draggable
              data={{
                type: "pattern",
                source: spriteSheet.source,
                tiles,
              }}
              draggedItem={{
                display: () => {
                  const canvas = document.createElement("canvas");
                  canvas.width = sizeIndex[0] * 16;
                  canvas.height = sizeIndex[1] * 16;
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(
                    buffer,
                    0,
                    0,
                  );
                  return canvas;
                },
              }}
            >
              <canvas
                ref={ref}
                width={size.x}
                height={size.y}
              />
            </Draggable>
          </div>
          <div className="p-2">
            <Text>{pattern.name.toLocaleUpperCase()}</Text>
          </div>
        </div>
        
        
      }
    />
    
  );
}

export { SpriteSheetPattern };
