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
      spriteSheet.image,
      index[0] * 16,
      index[1] * 16,
      16,
      16,
      0,
      0,
      16,
      16
    );
  }, []);

  useEffect(() => {
    drawImage(ref.current);
  }, []);
  
  return (
    <div className="px-1 py-0.5 odd:bg-[#2B2B2B]">
      <Draggable
        data={{ type: "tile", filename: spriteSheet.filename, index }}
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
