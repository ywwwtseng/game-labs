import { Matrix } from '@/js/math';
import World from '@/js/World';
import { createBackgroundLayer } from '@/js/layers/background';
import { createSpriteLayer } from '@/js/layers/sprites';
import { loadJSON, loadSpriteSheet } from '@/js/loaders';

function setupCollision(worldSpec, world) {
  const mergedTiles = worldSpec.layers.reduce((mergedTiles, layerSpec) => {
    return mergedTiles.concat(layerSpec.tiles);
  }, []);

  const collisionGrid = createCollisionGrid(mergedTiles, worldSpec.patterns);
  world.setCollisionGird(collisionGrid);
}

function setupBackgrounds(worldSpec, world, backgroundSprites) {
  worldSpec.layers.forEach((layer) => {
    const backgroundGrid = createBackgroundGrid(layer.tiles, worldSpec.patterns);
    const backgroundLayer = createBackgroundLayer(world, backgroundGrid, backgroundSprites);
    world.comp.layers.push(backgroundLayer);
  });
}

function setupEntities(worldSpec, world, entityFactory) {
  worldSpec.entities.forEach(({name, pos: [x, y]}) => {
    const createEntity = entityFactory[name];
    const entity = createEntity();
    entity.pos.set(x, y);
    world.entities.push(entity);
  });
  const spriteLayer = createSpriteLayer(world.entities);
  world.comp.layers.push(spriteLayer);
}

export function createWorldLoader(entityFactory) {
  return function loadWorld(name) {
    return loadJSON(`/world/${name}.json`)
      .then((worldSpec) => Promise.all([
        worldSpec,
        loadSpriteSheet(worldSpec.spriteSheet),
      ]))
      .then((([worldSpec, backgroundSprites]) => {
      const world = new World();

      setupCollision(worldSpec, world);
      setupBackgrounds(worldSpec, world, backgroundSprites);
      setupEntities(worldSpec, world, entityFactory);

      return world;
    }));
  }
}

function createCollisionGrid(tiles, patterns) {
  const grid = new Matrix();

  for (const {tile, x, y} of expandTiles(tiles, patterns)) {
    grid.set(x, y, {type: tile.type});
  }

  return grid;
}

function createBackgroundGrid(tiles, patterns) {
  const grid = new Matrix();

  for (const {tile, x, y} of expandTiles(tiles, patterns)) {
    grid.set(x, y, {name: tile.name});
  }

  return grid;
}

function* expandSpan(xStart, xLen, yStart, yLen) {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;

  for (let x = xStart; x < xEnd; ++x) {
    for (let y = yStart; y < yEnd; ++y) {
      yield {x, y};
    }
  }
}

function expandRange(range) {
  if (range.length === 4) {
    const [xStart, xLen, yStart, yLen] = range;
    return expandSpan(xStart, xLen, yStart, yLen);
  } else if (range.length === 3) {
    const [xStart, xLen, yStart] = range;
    return expandSpan(xStart, xLen, yStart, 1);
  } else if (range.length === 2) {
    const [xStart, yStart] = range;
    return expandSpan(xStart, 1, yStart, 1);
  }
}

function* expandRanges(ranges) {
  for (const range of ranges) {
    yield* expandRange(range);
  }
}

function* expandTiles(tiles, patterns) {
  function* walkTiles(tiles, offsetX = 0, offsetY = 0) {
    for (const tile of tiles) {
      for (const {x, y} of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;
  
        if (tile.pattern) {
          const tiles = patterns[tile.pattern].tiles;
          yield* walkTiles(tiles, derivedX, derivedY);
        } else {
          yield {
            tile,
            x: derivedX,
            y: derivedY,
          };
        }
        
      }
    }
  }

  yield* walkTiles(tiles, 0, 0);
}
