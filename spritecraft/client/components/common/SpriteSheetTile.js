import { useCallback, useEffect, useRef } from "react";
import { Draggable } from "@/components/common/Draggable";

function SpriteSheetTile({ spriteSheet, index, width = 16, height = 16 }) {
  const ref = useRef(null);

  const drawImage = useCallback((el) => {
    if (el.tagName !== "CANVAS") {
      return;
    }

    const ctx = el.getContext("2d");
    ctx.drawImage(
      spriteSheet.tiles[index[0]][index[1]].buffer,
      0,
      0,
    );
  }, []);

  useEffect(() => {
    drawImage(ref.current);
  }, []);
  
  return (
    <div className="px-1 py-0.5 odd:bg-[#2B2B2B]">
      <Draggable
        data={{ type: "tile", buffer: spriteSheet.tiles[index[0]][index[1]] }}
        cloneAfter={(el) => {
          drawImage(el);
          return el;
        }}
      >
        <canvas
          ref={ref}
          width={width}
          height={height}
        />
      </Draggable>
      
    </div>
  );
}

export { SpriteSheetTile };
