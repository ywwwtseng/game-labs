import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { ModeConnectToCanvas } from '@/containers/ModeConnectToCanvas';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { usePatterns } from '@/hooks/usePatterns';
import { CanvasUtil } from '@/utils/CanvasUtil';

function SceneCanvas() {
  const scene = useSelector((state) => state.appState.scene);
  const spriteSheets = useSpriteSheets();
  const patterns = usePatterns();

  const layers = useMemo(
    () => [
      CANVAS_LAYER.SPRITE_LAYERS({
        layers: CanvasUtil.createSpriteLayers({ scene, spriteSheets, patterns }),
        width: scene.width,
        height: scene.height,
      }),
      CANVAS_LAYER.GRID({
        width: scene.width,
        height: scene.height,
      }),
    ],
    [scene, spriteSheets, patterns],
  );

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
              id="canvas"
              accept="tiles"
              width={scene.width}
              height={scene.height}
              layers={layers}
              {...connect}
            />
          )}
        </div>
      )}
    </ModeConnectToCanvas>
  );
}

export { SceneCanvas };
