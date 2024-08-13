import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { ModeConnectToCanvas } from '@/containers/ModeConnectToCanvas';
import { useSpriteSheets } from '@/features/appState/SpriteSheetContext';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { Object2DUtil } from '@/utils/Object2DUtil';
import { selectedLand } from '@/features/appState/appStateSlice';
import { useQuery } from '@/features/query/QueryClientContext';
import { sql } from '@/sql';

function LandCanvas() {
  const land = useSelector(selectedLand);
  const spriteSheets = useSpriteSheets();
  const { data: object2ds } = useQuery(sql.object2ds.list);
  const spritesLayers = useMemo(() => {
    return CANVAS_LAYER.SPRITE_LAYERS({
      layers: CanvasUtil.createSpriteLayers({ land, spriteSheets }),
      width: land.width,
      height: land.height,
    });
  }, [land, spriteSheets]);

  const object2DBuffers = useMemo(() => {
    return CanvasUtil.createObject2DBuffers({ land, spriteSheets, object2ds });
  }, [land, spriteSheets, object2ds]);


  const object2DLayers = useCallback((lifetime) => {
    return function(ctx) {
      return CanvasUtil.createObject2DLayersBuffer({ ctx, lifetime, land, object2ds, spriteSheets, object2DBuffers });
    };
  }, [land, object2ds, spriteSheets, object2DBuffers]);

  const gridLayer = useMemo(() => {
    return CANVAS_LAYER.GRID({
      width: land.width,
      height: land.height,
    });
  }, [land]);

  const layers = useCallback(
    (lifetime) => [
      spritesLayers,
      object2DLayers(lifetime),
      (lifetime === undefined && gridLayer),
    ].filter(Boolean),
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
              layers={layers(connect.lifetime)}
              {...connect}
            />
          )}
        </div>
      )}
    </ModeConnectToCanvas>
  );
}

export { LandCanvas };
