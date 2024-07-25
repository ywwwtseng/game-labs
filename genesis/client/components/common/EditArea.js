import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Canvas2D } from "@/components/common/Canvas2D";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { setCursorPosition, addSceneTile } from "@/features/appState/appStateSlice";
import { selectAreaStart, selectArea, selectAreaStop } from '@/features/sceneSelectArea/sceneSelectAreaSlice';
import { useICanvasSelectArea } from "@/hooks/useCanvasSelectArea";
import { useSpriteSheets } from '@/context/SpriteSheetContext';

function EditArea() {
  const poistion = useSelector((state) => state.appState.cursor.poistion);
  const scene = useSelector((state) => state.appState.scene);
  const selected = useSelector((state) => state.sceneSelectArea.selected);
  const spriteSheets = useSpriteSheets();

  const dispatch = useDispatch();
  const { register, connect } = useICanvasSelectArea({
    canvasId: "canvas",
    selected,
    poistion,
    selectAreaStart: (index) => dispatch(selectAreaStart(index)),
    selectArea: (index) => dispatch(selectArea(index)),
    selectAreaStop: () => dispatch(selectAreaStop()),
    setCursorPosition: (poistion) => dispatch(setCursorPosition(poistion)),
  });

  const layers = useMemo(() => {
    return scene.layers.map((layer) => {
      return {
        tiles: MatrixUtil.map(
          layer.tiles,
          ({ filename, index: [indexX, indexY] }) => ({
            buffer: spriteSheets[filename].tiles[indexX][indexY].buffer,
          })
        ),
      };
    });
  }, [spriteSheets, scene.layers]);

  const handleDrop = (event, data, index) => {
    event.preventDefault();
    if (!data) return;
    const [originX, originY, sizeX, sizeY] = data.selected;

    MatrixUtil.traverse([sizeX, sizeY], (x, y) => {
      dispatch(addSceneTile({
        index: [index[0] + x, index[1] + y],
        tile: {
          filename: data.filename,
          index: [originX + x, originY + y],
        }
      }));
    });
  };

  return (
    <div
      id="edit-area"
      className="relative z-10 rounded w-full h-full overflow-hidden flex items-center justify-center bg-[#353535]"
      {...register}
    >
      {scene && (
        <Canvas2D
          grid
          id="canvas"
          accept="tiles"
          layers={layers}
          selected={selected.index}
          width={scene.width}
          height={scene.height}
          onDrop={handleDrop}
          {...connect}
        />
      )}
    </div>
  );
}

export { EditArea };
