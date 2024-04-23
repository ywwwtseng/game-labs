function drawBackground(background, context, sprites) {
  background.ranges.forEach(([x1, x2, y1, y2]) => {
    for (let x = x1; x < x2; ++x) {
      for (let y = y1; y < y2; ++y) {
        sprites.draw(background.tile, context, x * 16, y * 16);
      }
    }
  });
}

export function createBackgroundLayer(land, sprites) {
  const buffer = document.createElement('canvas');
  buffer.width = 256;
  buffer.height = 240;

  const context = buffer.getContext('2d');

  land.tiles.forEach((tile, x, y) => {
    sprites.drawTile(tile.name, context, x, y);
  });

  return function drawBackgroundLayer(context) {
    context.drawImage(buffer, 0, 0);
  };
}

export function createSpriteLayer(entities) {
  return function drawSpriteLayer(context) {
    entities.forEach((entity) => {
      entity.draw(context);
    });
  };
}

export function createCollisionLayer(land) {
  const resolvedTiles = [];

  const tileResolver = land.tileCollider.tiles;
  const tileSize = tileResolver.tileSize;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({x, y});
    return getByIndexOriginal.call(tileResolver, x, y);
  }

  return function drawCollision(context) {
    context.strokeStyle = 'blue';
    resolvedTiles.forEach(({x, y}) => {
      console.log('world', x, y);
    });

    resolvedTiles.length = 0;
  };
}