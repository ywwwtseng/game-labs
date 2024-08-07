import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { ModeConnectToCanvas } from '@/containers/ModeConnectToCanvas';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { useObject2Ds } from '@/queries/useObject2Ds';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { selectedLand } from '@/features/appState/appStateSlice';

function LandCanvas() {
  const land = useSelector(selectedLand);
  const spriteSheets = useSpriteSheets();
  const object2ds = useObject2Ds();
  const layers = useMemo(
    () => [
      CANVAS_LAYER.SPRITE_LAYERS({
        layers: CanvasUtil.createSpriteLayers({ land, spriteSheets }),
        width: land.width,
        height: land.height,
      }),
      CANVAS_LAYER.OBJECT2D_LAYERS({
        layers: CanvasUtil.createObject2DLayers({ land, spriteSheets, object2ds }),
        width: land.width,
        height: land.height,
      }),
      CANVAS_LAYER.GRID({
        width: land.width,
        height: land.height,
      }),
    ],
    [land, spriteSheets, object2ds],
  );

  return (
    <ModeConnectToCanvas>
      {({ register, connect }) => (
        <div
          id="edit-area"
          className="relative z-10 rounded w-full h-full overflow-hidden flex items-center justify-center bg-[#353535]"
          {...register}
        >
          {land && (
            <Canvas2D
              id="canvas"
              accept="tiles"
              width={land.width}
              height={land.height}
              layers={layers}
              {...connect}
            />
          )}
        </div>
      )}
    </ModeConnectToCanvas>
  );
}

export { LandCanvas };
