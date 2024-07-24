import { useContext, useMemo } from "react";
import { AppContext } from "@/store/AppContext";
import { Canvas2D } from "@/components/common/Canvas2D";
import { MatrixUtil } from '@/utils/MatrixUtil';
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

  const tiles = useMemo(() => {
    return MatrixUtil.map(state.scene.layers[0].tiles, ({ filename, index: [indexX, indexY] }) => ({
      buffer: state.spriteSheets[filename].tiles[indexX][indexY].buffer,
    }));
  }, [state.spriteSheets, state.scene.layers]);

  const handleDrop = (event, data, index) => {
    event.preventDefault();
    if (!data) return;
    const [originX, originY, sizeX, sizeY] = data.selected;

    MatrixUtil.traverse([sizeX, sizeY], (x, y) => {
      action.setSceneTile(
        [index[0] + x, index[1] + y],
        {
          filename: data.filename,
          index: [originX + x, originY + y]
        }
      );
    });
  };

  return (
      <div
        id="edit-area"
        className="relative z-10 rounded w-full h-full overflow-hidden flex items-center justify-center bg-[#353535]"
        {...register}
        >
        {state.scene && (
          <Canvas2D
            grid
            id="canvas"
            accept="tiles"
            tiles={tiles}
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
