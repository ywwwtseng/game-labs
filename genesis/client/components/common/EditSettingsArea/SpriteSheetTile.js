import { useCallback, useEffect, useRef } from "react";
import { Draggable } from "@/containers/Draggable";
import { OperableItem } from "@/components/common/OperableItem";

function SpriteSheetTile({ spriteSheet, index, width = 16, height = 16 }) {
  const ref = useRef(null);
  const transparent = spriteSheet.transparent.includes(`${index[0]}.${index[1]}`);
  const tile = spriteSheet.tiles[index[0]][index[1]];

  const drawImage = useCallback((el) => {
    if (el.tagName !== "CANVAS") {
      return;
    }

    const ctx = el.getContext("2d");
    ctx.drawImage(tile.buffer, 0, 0);
  }, []);

  useEffect(() => {
    if (!transparent) {
      drawImage(ref.current);
    }
  }, []);

  if (transparent) {
    return null;
  }

  return (
    <OperableItem
      label={
        <Draggable
          data={{
            type: "tiles",
            path: spriteSheet.path,
            index: [...index, 1, 1],
          }}
          draggedItem={{
            display: () => {
              const el = ref.current.cloneNode();
              drawImage(el);
              return el;
            },
            pos: (event, bounds) => ({
              x: event.pageX - bounds.size.x / 2,
              y: event.pageY - bounds.size.y / 2,
            }),
          }}
        >
          <canvas ref={ref} width={width} height={height} />
        </Draggable>
      }
    />
  );
}

export { SpriteSheetTile };
