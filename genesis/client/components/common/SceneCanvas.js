import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { ModeConnectToCanvas } from '@/containers/ModeConnectToCanvas';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { selectedLayerSelector } from '@/features/appState/appStateSlice';

function SceneCanvas() {
  selectedLayerSelector;
  const scene = useSelector((state) => state.appState.scene);
  const selectedLayer = useSelector(selectedLayerSelector);
  const spriteSheets = useSpriteSheets();

  const spriteLayers = useMemo(() => {
    if (Object.keys(spriteSheets).length === 0) {
      return [];
    }

    return scene.layers.map((layer) => {
      return {
        tiles: MatrixUtil.map(layer.tiles, (T) => {
          if (T.source && T.index) {
            const { source, index } = T;
            return {
              buffer: spriteSheets[source].tiles[index[0]][index[1]].buffer,
            };
          }
        }),
        patterns: Object.values(layer.patterns).map((pattern) => {
          const source = pattern.id.split('.')[0];

          return {
            id: pattern.id,
            index: pattern.index,
            tiles: MatrixUtil.map(pattern.tiles, (index) => {
              return index
                ? {
                    buffer:
                      spriteSheets[source].tiles[index[0]][index[1]].buffer,
                  }
                : undefined;
            }),
          };
        }),
      };
    });
  }, [spriteSheets, scene.layers]);

  const layers = useMemo(
    () => [
      CANVAS_LAYER.SPRITE_LAYER({
        layers: spriteLayers,
        width: scene.width,
        height: scene.height,
      }),
      CANVAS_LAYER.GRID({
        width: scene.width,
        height: scene.height,
      }),
    ],
    [scene],
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
