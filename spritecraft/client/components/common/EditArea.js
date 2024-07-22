import { useRef, useEffect, useContext } from "react";
import { AppContext } from "@/store/AppContext";
import { getPosition, getIndex } from '@/utils';


function EditArea() {
  const ref = useRef(null);
  const { state, action } = useContext(AppContext);

  const handleMouseMove = (event) => {
    const pos = getPosition(event);

    if (pos.x >= 0 && pos.y >= 0) {
      const index = getIndex(pos);

      action.setLocation([
        index.x,
        index.y,
      ]);
    }
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const payload = event.dataTransfer.getData("payload");
    if (!payload) return;

    const pos = getPosition(event);
    const index = getIndex(pos);
    const data = JSON.parse(payload);

    action.setSceneTile(index.x, index.y, data);
  };

  useEffect(() => {
    const ctx = ref.current.getContext("2d");

    ctx.clearRect(0, 0, state.scene.width + 1, state.scene.height + 1);

    for (var x = 0; x <= state.scene.width; x += 16) {
      ctx.moveTo(0.5 + x, 0);
      ctx.lineTo(0.5 + x, state.scene.height);
    }

    for (var x = 0; x <= state.scene.height; x += 16) {
      ctx.moveTo(0, 0.5 + x);
      ctx.lineTo(state.scene.width, 0.5 + x);
    }

    ctx.strokeStyle = "#424242";
    ctx.stroke();

    

    state.scene.tiles.forEach((column, x) => {
      column.forEach((value, y) => {
        if (value) {
          ctx.drawImage(
            state.spriteSheets[value.filename].image,
            value.index[0] * 16,
            value.index[1] * 16,
            16,
            16,
            x * 16,
            y * 16,
            16,
            16
          );
        }
      });
    });

    if (state.selectedIndex) {
      ctx.beginPath();
      ctx.rect(
        state.selectedIndex[0] * 16 + 0.5,
        state.selectedIndex[1] * 16 + 0.5,
        16,
        16
      );
      ctx.strokeStyle = "white";
      ctx.stroke();
    }

  }, [state.selectedIndex, state.scene]);

  return (
    <div
      className="rounded w-full h-full overflow-hidden flex items-center justify-center bg-[#353535]"
      onDragOver={allowDrop}
      onDrop={handleDrop}
      onMouseDown={() => action.setSelectedIndex(state.location || null)}
    >
      <div className="bg-[#373737]">
        <canvas
          ref={ref}
          width={state.scene.width + 1}
          height={state.scene.height + 1}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => action.setLocation(null)}
        />
      </div>
    </div>
  );
}

export { EditArea };
