import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { ModeConnectToCanvas } from '@/containers/ModeConnectToCanvas';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { useObject2Ds } from '@/queries/useObject2Ds';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { Object2DUtil } from '@/utils/Object2DUtil';
import { selectedLand } from '@/features/appState/appStateSlice';

function LandCanvas() {
  const land = useSelector(selectedLand);
  const spriteSheets = useSpriteSheets();
  const object2ds = useObject2Ds();
  const spritesLayer = useMemo(() => {
    return CANVAS_LAYER.SPRITE_LAYERS({
      layers: CanvasUtil.createSpriteLayers({ land, spriteSheets }),
      width: land.width,
      height: land.height,
    });
  }, [land, spriteSheets]);

  const object2DBuffer = useMemo(() => {
    const buffer = {};
    if (Object.keys(spriteSheets).length === 0 || object2ds.length === 0) {
      return buffer;
    }

    land.layers.forEach((layer) => {
      layer.object2ds.forEach(({ id: object2d_id }) => {
        const object2d = object2ds.find(({ id }) => id === object2d_id);
        if (!buffer[object2d.id]) {
          if (Object2DUtil.hasAnimation(object2d)) {
            buffer[object2d.id] = {
              frames: object2d.frames.map((tiles) => {
                return CanvasUtil.transferTilesToBuffer({ tiles, spriteSheets });
              })
            };
          } else {

            buffer[object2d.id] = CanvasUtil.transferTilesToBuffer({ tiles: object2d.tiles, spriteSheets });
          }
        }
      })
    });

    return buffer;
  }, [land, spriteSheets]);


  const object2DLayer = useCallback((lifetime) => {
    return function(ctx) {
      if (Object.keys(spriteSheets).length === 0 || object2ds.length === 0) {
        return [];
      }
  
      return land.layers.forEach((layer) => {
        layer.object2ds.forEach((object2d) => {
          if (!object2DBuffer[object2d.id].frames) {
            const tilesBuffer = object2DBuffer[object2d.id];
            CanvasUtil.drawTilesOnCanvas(ctx, tilesBuffer, { x: object2d.rect[0], y: object2d.rect[1] })
          } else {
            const frames = object2DBuffer[object2d.id].frames;
            const frameLen = 0.07
            const frameIndex = lifetime ? Math.floor(lifetime / frameLen) % frames.length : 0;
            const frame = frames[frameIndex];
            CanvasUtil.drawTilesOnCanvas(ctx, frame, { x: object2d.rect[0], y: object2d.rect[1] })
          }
        });
      });
    };
  }, [land, spriteSheets, object2DBuffer]);

  const gridLayer = useMemo(() => {
    return CANVAS_LAYER.GRID({
      width: land.width,
      height: land.height,
    });
  }, [land]);

  const layers = useCallback(
    (lifetime) => [
      spritesLayer,
      object2DLayer(lifetime),
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
