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
        data={{ type: "tiles", filename: spriteSheet.filename, selected: [...index, 1, 1] }}
        draggedItem={{
          display: () => {
            const el = ref.current.cloneNode();
            drawImage(el);
            return el;
          },
          pos: (event, bounds) => ({
            x: event.pageX - bounds.size.x / 2,
            y: event.pageY - bounds.size.y / 2,
          })
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
