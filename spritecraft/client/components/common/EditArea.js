import { useContext } from "react";
import { AppContext } from "@/store/AppContext";
import { Canvas2D } from "@/components/common/Canvas2D";
import { CanvasUtil } from '@/utils/CanvasUtil';
import { useCanvasSelectorWoState } from '@/hooks/useCanvasSelector';


function EditArea() {
  const { state, action } = useContext(AppContext);
  const { register, connect } = useCanvasSelectorWoState({
    canvasId: 'canvas',
    selected: state.selected,
    location: state.location,
    select: action.select,
    selectStart: action.selectStart,
    selectStop: action.selectStop,
    setLocation: action.setLocation,
  });

  const handleDrop = (event, item, pos) => {
    event.preventDefault();
    if (!item) return;

    const index = CanvasUtil.positionToIndex(pos);
    action.setSceneTile(index.x, index.y, item.buffer);
  };

  return (
      <div
        className="relative z-10 rounded w-full h-full overflow-hidden flex items-center justify-center bg-[#353535]"
        {...register}
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
            {...connect}
          />
        )}
        
      </div>
  );
}

export { EditArea };
