import { useContext } from "react";
import { AppContext } from "@/store/AppContext";
import { Canvas2D } from "@/components/common/Canvas2D";
import { CanvasUtil } from '@/utils/CanvasUtil';


function EditArea() {
  const { state, action } = useContext(AppContext);

  const handleMouseMove = (event) => {
    const pos = CanvasUtil.getPositionInCanvas(event);

    if (pos.x >= 0 && pos.y >= 0) {
      const index = CanvasUtil.positionToIndex(pos);

      action.setLocation([
        index.x,
        index.y,
      ]);
    }
  };

  const handleDrop = (event, item, pos) => {
    event.preventDefault();
    if (!item) return;

    const index = CanvasUtil.positionToIndex(pos);
    action.setSceneTile(index.x, index.y, item);
  };

  return (
      <div
        className="rounded w-full h-full overflow-hidden flex items-center justify-center bg-[#353535]"
        onMouseDown={() => action.setSelectedIndex(state.location || null)}
        >
        {state.scene && (
          <Canvas2D
            grid
            tiles={state.scene.tiles}
            selected={state.selectedIndex}
            width={state.scene.width}
            height={state.scene.height}
            onDrop={handleDrop}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => action.setLocation(null)}
          />
        )}
        
      </div>
  );
}

export { EditArea };
