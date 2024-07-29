import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Canvas2D } from "@/components/common/Canvas2D";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { ModeConnectToCanvas } from "@/containers/ModeConnectToCanvas";
import { useSpriteSheets } from "@/context/SpriteSheetContext";

function SceneCanvas() {
  const scene = useSelector((state) => state.appState.scene);
  const spriteSheets = useSpriteSheets();

  const layers = useMemo(() => {
    return scene.layers.map((layer) => {
      return {
        tiles: MatrixUtil.map(
          layer.tiles,
          ({ source, index: [indexX, indexY] }) => ({
            buffer: spriteSheets[source].tiles[indexX][indexY].buffer,
          })
        ),
      };
    });
  }, [spriteSheets, scene.layers]);

  return (
    <ModeConnectToCanvas>
      {({ register, connect }) => (
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
              width={scene.width}
              height={scene.height}
              {...connect}
            />
          )}
        </div>
      )}
    </ModeConnectToCanvas>
  );
}

export { SceneCanvas };
