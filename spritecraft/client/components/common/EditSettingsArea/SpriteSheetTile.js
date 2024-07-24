import { useCallback, useEffect, useRef } from "react";
import { Draggable } from "@/components/common/Draggable";
import { OperablItem } from "@/components/common/OperablItem";
import { BaseButton } from "@/components/ui/BaseButton";
import { PenNibIcon } from "@/components/icon/PenNibIcon";

function SpriteSheetTile({ spriteSheet, index, width = 16, height = 16, onFill }) {
  const ref = useRef(null);

  const drawImage = useCallback((el) => {
    if (el.tagName !== "CANVAS") {
      return;
    }

    const ctx = el.getContext("2d");
    ctx.drawImage(spriteSheet.tiles[index[0]][index[1]].buffer, 0, 0);
  }, []);

  useEffect(() => {
    drawImage(ref.current);
  }, []);

  return (
    <OperablItem
      label={
        <Draggable
          data={{
            type: "tiles",
            filename: spriteSheet.filename,
            selected: [...index, 1, 1],
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
      actions={[
        <BaseButton
          key="fill"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onFill({ type: "tile", filename: spriteSheet.filename, index });
          }}
        >
          <PenNibIcon size="4" />
        </BaseButton>,
      ]}
    />
  );
}

export { SpriteSheetTile };
