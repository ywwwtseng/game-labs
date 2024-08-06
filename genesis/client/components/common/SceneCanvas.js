import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { ModeConnectToCanvas } from '@/containers/ModeConnectToCanvas';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { usePatterns } from '@/hooks/usePatterns';

function SceneCanvas() {
  const scene = useSelector((state) => state.appState.scene);
  const spriteSheets = useSpriteSheets();
  const patterns = usePatterns();

  const layers = useMemo(
    () => [
      CANVAS_LAYER.SPRITE_LAYER({
        layers: (() => {
          if (Object.keys(spriteSheets).length === 0 || patterns.length === 0) {
            return [];
          }
      
          return scene.layers.map((layer) => {
            return {
              tiles: MatrixUtil.map(layer.tiles, (tileItems) => {
                return tileItems.map((tile) => {
                  if (tile.source && tile.index) {
                    const { source, index } = tile;
                    return {
                      buffer: spriteSheets[source].tiles[index[0]][index[1]].buffer,
                    };
                  }
                });
              }),
              patterns: layer.patterns.reduce((acc, { id: pattern_id, rect: pattern_rect }) => {
                const pattern = patterns.find(({ id }) => id === pattern_id);
                if (!acc.buffer[pattern.id]) {
                  acc.buffer[pattern.id] = MatrixUtil.create(pattern.tiles, ({ value: tileItems }) => {
                    console.log(tileItems, 'tileItems')
                    return tileItems?.map((tile) => ({
                      buffer: spriteSheets[tile.source].tiles[tile.index[0]][tile.index[1]].buffer,
                    }));
                  });
                }
      
                acc.order = [...acc.order, {
                  id: pattern.id,
                  rect: pattern_rect,
                }];
      
                return acc;
              }, { buffer: {}, order: [] }),
            };
          });
        })(),
        width: scene.width,
        height: scene.height,
      }),
      CANVAS_LAYER.GRID({
        width: scene.width,
        height: scene.height,
      }),
    ],
    [spriteSheets, patterns, scene],
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
