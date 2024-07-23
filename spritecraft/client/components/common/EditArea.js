import { useContext } from "react";
import { AppContext } from "@/store/AppContext";
import { Canvas2D } from "@/components/common/Canvas2D";
import { CanvasUtil } from '@/utils/CanvasUtil';


function EditArea() {
  const { state, action } = useContext(AppContext);

  const handleMouseMove = (event) => {

    const pos = CanvasUtil.getPositionInCanvas(
      event,
      document.getElementById("canvas"),
    );

    const index = CanvasUtil.positionToIndex(pos);

    if (pos.within) {
      action.setLocation([
        index.x,
        index.y,
      ]);
    }

    if (state.selected.progress) {
      const dx = index.x - state.selected.index[0];
      const dy = index.y - state.selected.index[1];
      
      action.select([
        state.selected.index[0],
        state.selected.index[1],
        dx > 0 ? dx + 1 : dx === 0 ? 1 : dx - 1,
        dy > 0 ? dy + 1 : dy === 0 ? 1 : dy - 1,
      ]);
    }
  };

  const handleDrop = (event, item, pos) => {
    event.preventDefault();
    if (!item) return;

    const index = CanvasUtil.positionToIndex(pos);
    action.setSceneTile(index.x, index.y, item.buffer);
  };

  return (
      <div
        className="relative z-10 rounded w-full h-full overflow-hidden flex items-center justify-center bg-[#353535]"
        onMouseDown={() => action.selectStart(state.location ? [...state.location, 1, 1] : null)}
        onMouseUp={() => action.selectStop()}
        onMouseMove={handleMouseMove}
        >
        {state.scene && (
          <Canvas2D
            grid
            id="canvas"
            tiles={state.scene.tiles}
            selected={state.selected.index}
            width={state.scene.width}
            height={state.scene.height}
            onDrop={handleDrop}
            onMouseLeave={() => action.setLocation(null)}
          />
        )}
        
      </div>
  );
}

export { EditArea };
