import Dimensions from '@/engine/Dimensions';
import TileResolver from '@/engine/TileResolver';
 import { Vec2 } from '@/engine/math';

export function createBackgroundLayer(scene, tiles, sprites) {
  const resolver = new TileResolver(tiles);

  const buffer = document.createElement('canvas');
  buffer.width = Dimensions.get('canvas').width + 16;
  buffer.height = Dimensions.get('canvas').height + 16;

  window.addEventListener('resize', (event) => {
    buffer.width = Dimensions.get('canvas').width + 16;
    buffer.height = Dimensions.get('canvas').height + 16;
  });

  const context = buffer.getContext('2d');

  function redraw(startIndex, endIndex) {
    context.clearRect(0, 0, buffer.width, buffer.height);

    for (let x = startIndex.x; x <= endIndex.x; ++x) {
      for (let y = startIndex.y; y <= endIndex.y; ++y) {
        const col = tiles.grid[x];

        if (col) {
          const tile = col[y];

          if (tile) {
            if (sprites.animations.has(tile.name)) {
              sprites.drawAnim(tile.name, context, x - startIndex.x, y - startIndex.y, scene.totalTime);
            } else {
              sprites.drawTile(tile.name, context, x - startIndex.x, y - startIndex.y);
            }
          }
          
        }
      }
    }
  }

  return function drawBackgroundLayer(context, camera) {
    const drawSize = new Vec2(
      resolver.toIndex(camera.size.x),
      resolver.toIndex(camera.size.y),
    );
    const drawFrom = new Vec2(
      resolver.toIndex(camera.pos.x),
      resolver.toIndex(camera.pos.y)
    );
    const drawTo = drawFrom.clone().add(drawSize);

    redraw(drawFrom, drawTo);

    context.drawImage(
      buffer,
      Math.floor(-camera.pos.x % 16),
      Math.floor(-camera.pos.y % 16),
    );
  };
}