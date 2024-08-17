import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { ModeConnectToCanvas } from '@/containers/ModeConnectToCanvas';
import { useSpriteSheets } from '@/features/appState/SpriteSheetContext';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { selectedLand } from '@/features/appState/appStateSlice';
import { useCamera, useCameraResizer } from '@/hooks/useCamera';
import { useQuery } from '@/hooks/useQuery';
import { sql } from '@/sql';
import { S_KEY, useKeyBoard } from '@/hooks/useKeyBoard';
import { EventUtil } from '@/utils/EventUtil';
import { useMutation } from '@/hooks/useMutation';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { LandCanvasMap } from '@/components/common/LandCanvasMap';

function LandCanvas() {
  const camera = useCamera();
  const spriteSheets = useSpriteSheets();
  const land = useSelector(selectedLand);
  
  const { data: object2ds } = useQuery(sql.object2ds.list);
  const updateLand = useMutation(sql.lands.update);

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
  }, [land, spriteSheets, object2ds, object2DBuffers]);

  

  const gridLayer = useMemo(() => {
    return CANVAS_LAYER.GRID({
      width: camera.size.x,
      height: camera.size.y,
    });
  }, [camera.size]);

  const layers = useCallback(
    (lifetime) => [
      spritesLayers,
      object2DLayers(lifetime, camera),
      (lifetime === undefined && gridLayer),
    ].filter(Boolean),
    [spritesLayers, object2DLayers, gridLayer, camera],
  );

  useCameraResizer();

  useKeyBoard(
    {
      [S_KEY]: (event) => {
        if (event.metaKey) {
          EventUtil.stop(event);

          if (land) {
            updateLand.mutate({
              params: {
                id: land.id,
              },
              data: {
                land: {
                  layers: land.layers.map((layer) => ({
                    name: layer.name,
                    object2ds: layer.object2ds,
                    tiles: MatrixUtil.create([1024/16, 1024/16], ({ x, y }) => {
                      return layer.tiles?.[x]?.[y] || [];
                    }),
                  }))
                }
              },
            });
          }

        }
      }
    },
    [land]
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
            <>
              <LandCanvasMap
                object2DLayers={object2DLayers}
                camera={camera}
                land={land}
                spriteSheets={spriteSheets}
              />
              <Canvas2D
                id="canvas"
                accept="tiles"
                width={camera.size.x}
                height={camera.size.y}
                layers={layers(connect.lifetime)}
                {...connect}
              />
            </>
          )}
        </div>
      )}
    </ModeConnectToCanvas>
  );
}

LandCanvas.Empty = () => {
  return (
    <div className="relative z-10 rounded w-full h-full overflow-hidden flex items-center justify-center bg-[#353535]" />
  )
};

export { LandCanvas };
