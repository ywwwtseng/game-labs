import { Matrix } from '@/js/math';
import World from '@/js/World';
import { createBackgroundLayer } from '@/js/layers/background';
import { createSpriteLayer } from '@/js/layers/sprites';
import { loadMusicSheet } from '@/js/loaders/music';
import { loadSpriteSheet } from '@/js/loaders/sprite';
import { loadJSON } from '@/js/loaders';

function setupBackgrounds(worldSpec, world, worldSprites) {
  worldSpec.layers.forEach((layer) => {
    const grid = createGrid(layer.tiles, worldSpec.patterns);
    const backgroundLayer = createBackgroundLayer(world, grid, worldSprites);
    world.comp.layers.push(backgroundLayer);
    world.tileCollider.addGrid(grid);
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
  return function loadWorld() {
    return loadJSON('/world/world.json')
      .then((worldSpec) => Promise.all([
        worldSpec,
        loadSpriteSheet(worldSpec.spriteSheet),
        loadMusicSheet(worldSpec.spriteSheet),
      ]))
      .then((([worldSpec, worldSprites, musicPlayer]) => {
      const world = new World();

      world.music.setPlayer(musicPlayer);

      setupBackgrounds(worldSpec, world, worldSprites);
      setupEntities(worldSpec, world, entityFactory, worldSprites);

      return world;
    }));
  }
}

function createGrid(tiles, patterns) {
  const grid = new Matrix();

  for (const {tile, x, y} of expandTiles(tiles, patterns)) {
    grid.set(x, y, tile);
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
