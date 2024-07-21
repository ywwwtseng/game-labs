import { useEffect, useRef } from "react";

function SpriteSheetTile({ spriteSheet, index, width = 16, height = 16 }) {
  const ref = useRef(null);

  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "payload",
      JSON.stringify({ ...spriteSheet, index })
    );
  };

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
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
  return (
    <div className="px-1 py-0.5 odd:bg-[#2B2B2B]">
      <canvas
        draggable="true"
        onDragStart={handleDragStart}
        ref={ref}
        width={width}
        height={height}
      ></canvas>
    </div>
  );
}

export { SpriteSheetTile };
