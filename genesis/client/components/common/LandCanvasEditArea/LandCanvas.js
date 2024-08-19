import { useMemo, useCallback } from 'react';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { useSpriteSheets } from '@/features/appState/SpriteSheetContext';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { useCamera, useCameraResizeObserver } from '@/hooks/useCamera';
import { useQuery } from '@/hooks/useQuery';
import { sql } from '@/sql';
import { LandCanvasMap } from '@/components/common/LandCanvasEditArea/LandCanvasMap';

function LandCanvas({ land, lifetime, grid, ...connect }) {
  const camera = useCamera();
  const spriteSheets = useSpriteSheets();
  
  const { data: object2ds } = useQuery(sql.object2ds.list);

  const spritesLayers = useMemo(() => {
    return CANVAS_LAYER.SPRITE_LAYERS({
      layers: CanvasUtil.createSpriteLayers({ land, spriteSheets }),
      camera,
    });
  }, [land, spriteSheets, camera]);

  const object2DBuffers = useMemo(() => {
    return CanvasUtil.createObject2DBuffers({ land, spriteSheets, object2ds });
  }, [land, spriteSheets, object2ds]);


  const object2DLayers = useCallback((lifetime, camera) => {
    return function(ctx) {
      return CanvasUtil.createObject2DLayersBuffer({ ctx, lifetime, land, object2ds, spriteSheets, object2DBuffers, camera });
    };
  }, [land, spriteSheets, object2ds, object2DBuffers, lifetime, camera]);

  const gridLayer = useMemo(() => {
    return CANVAS_LAYER.GRID({
      width: camera.size.x,
      height: camera.size.y,
    });
  }, [camera.size]);

  const layers = useMemo(
    () => [
      spritesLayers,
      object2DLayers(lifetime, camera),
      (grid && gridLayer),
    ].filter(Boolean),
    [spritesLayers, object2DLayers, gridLayer, camera, lifetime, grid],
  );

  useCameraResizeObserver();

  return (
    <>
      <LandCanvasMap
        object2DLayers={object2DLayers}
        camera={camera}
        land={land}
        spriteSheets={spriteSheets}
      />
      <Canvas2D
        id="canvas"
        width={camera.size.x}
        height={camera.size.y}
        layers={layers}
        {...connect}
      />
    </>
  );
}

export { LandCanvas };
