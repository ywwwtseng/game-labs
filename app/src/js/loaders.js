import World from '@/js/World';
import SpriteSheet from '@/js/SpriteSheet';
import { createBackgroundLayer, createSpriteLayer } from '@/js/layers';
import { createAnim } from '@/js/anim';

export function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

function loadJSON(url) {
  return fetch(url)
    .then((r) => r.json());
}

function createTiles(world, backgrounds) {

  function applyRange(background, xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;

    for (let x = xStart; x < xEnd; ++x) {
      for (let y = yStart; y < yEnd; ++y) {
        world.tiles.set(x, y, {
          name: background.tile,
          type: background.type,
        });
      }
    }
  }

  backgrounds.forEach((background) => {
    background.ranges.forEach((range) => {
      if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        applyRange(background, xStart, xLen, yStart, yLen);
      } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        applyRange(background, xStart, xLen, yStart, 1);
      } else if (range.length === 2) {
        const [xStart, yStart] = range;
        applyRange(background, xStart, 1, yStart, 1);
      }
    }); 
  });
}

export function loadSpriteSheet(name) {
  return loadJSON(`sprites/${name}.json`)
    .then((sheetSpec) => Promise.all([
      sheetSpec,
      loadImage(sheetSpec.imageURL),
    ]))
    .then(([sheetSpec, image]) => {
      const sprites = new SpriteSheet(
        image,
        sheetSpec.tileW,
        sheetSpec.tileH,
      );

      if (sheetSpec.tiles) {
        sheetSpec.tiles.forEach((tileSpec) => {
          sprites.defineTile(
            tileSpec.name,
            tileSpec.index[0],
            tileSpec.index[1],
          );
        });
      }

      if (sheetSpec.frames) {
        sheetSpec.frames.forEach((frameSpec) => {
          sprites.define(frameSpec.name, ...frameSpec.rect);
        });
      }

      if (sheetSpec.animations) {
        sheetSpec.animations.forEach((animSpec) => {
          const animation = createAnim(animSpec.frames, animSpec.frameLen);
          sprites.defineAnim(animSpec.name, animation);
        });
      }

      return sprites;
    });
}

export function loadWorld(name) {
  return loadJSON(`/world/${name}.json`)
    .then((worldSpec) => Promise.all([
      worldSpec,
      loadSpriteSheet(worldSpec.spriteSheet),
    ]))
    .then((([worldSpec, backgroundSprites]) => {
    const world = new World();

    createTiles(world, worldSpec.backgrounds);

    const backgroundLayer = createBackgroundLayer(world, backgroundSprites);
    world.comp.layers.push(backgroundLayer);

    const spriteLayer = createSpriteLayer(world.entities);
    world.comp.layers.push(spriteLayer);

    return world;
  }));
}
