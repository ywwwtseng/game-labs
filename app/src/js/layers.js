import TileResolver from '@/js/TileResolver';
import { Vec2 } from '@/js/math';

export function createBackgroundLayer(world, tiles, sprites) {
  const resolver = new TileResolver(tiles);

  const buffer = document.createElement('canvas');
  buffer.width = 256 + 16;
  buffer.height = 240 + 16;

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
              sprites.drawAnim(tile.name, context, x - startIndex.x, y - startIndex.y, world.totalTime);
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

export function createSpriteLayer(entities, width = 64, height = 64) {
  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = width;
  spriteBuffer.height = height;
  const spriteBufferContext = spriteBuffer.getContext('2d');

  return function drawSpriteLayer(context, camera) {
    entities.forEach((entity) => {
      spriteBufferContext.clearRect(0, 0, width, height);

      entity.draw(spriteBufferContext);

      context.drawImage(
        spriteBuffer,
        entity.pos.x - camera.pos.x,
        entity.pos.y - camera.pos.y,
      );
    });
  };
}

export function createCollisionLayer(world) {
  const resolvedTiles = [];

  const tileResolver = world.tileCollider.tiles;
  const tileSize = tileResolver.tileSize;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({x, y});
    return getByIndexOriginal.call(tileResolver, x, y);
  }

  return function drawCollision(context, camera) {
    context.strokeStyle = 'blue';
    resolvedTiles.forEach(({x, y}) => {
      context.beginPath();
      context.rect(
        x * tileSize - camera.pos.x,
        y * tileSize - camera.pos.y,
        tileSize,
        tileSize
      );
      context.stroke();
    });

    context.strokeStyle = 'red';
    world.entities.forEach((entity) => {
      context.beginPath();
      context.rect(
        entity.bounds.left - camera.pos.x,
        entity.bounds.top - camera.pos.y,
        entity.size.x,
        entity.size.y
      );
      context.stroke();
    });

    resolvedTiles.length = 0;
  };
}

export function createCameraLayer(cameraToDraw) {
  return function drawCameraRect(context, fromCamera) {
    context.strokeStyle = 'purple';
    context.rect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y
    );
    context.stroke();
  };
}