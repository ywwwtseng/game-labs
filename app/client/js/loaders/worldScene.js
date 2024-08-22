import { Matrix } from '@/engine/math';
import Entity from '@/engine/Entity';
import { createBackgroundLayer } from '@/engine/layers/background';
import { createSpriteLayer } from '@/engine/layers/sprites';
import { loadMusicSheet } from '@/engine/loaders/music';
import { loadObject2Ds } from '@/engine/loaders/object2d';
import { loadSpriteSheets } from '@/engine/loaders/sprite';
import { loadJSON } from '@/engine/loaders';

import SceneTimer from '@/js/traits/SceneTimer';
import Trigger from '@/js/traits/Trigger';
import WorldScene from '@/js/scenes/WorldScene';

function createTimer() {
  const timer = new Entity();
  timer.addTrait(new SceneTimer());
  return timer;
}

function loadPatternSheet(name) {
  return loadJSON(`/sprites/patterns/${name}.json`);
}

function setupBehavior(scene) {
  const timer = createTimer();
  scene.entities.push(timer);

  scene.events.listen(SceneTimer.EVENT_TIMER_OK, () => {
    scene.music.playTheme();
  });

  scene.events.listen(SceneTimer.EVENT_TIMER_IDLE, () => {
    scene.music.playIdleTheme();
  });
}

function setupBackgrounds(land, scene, sprites, object2ds) {
  land.layers.forEach((layer) => {
    const tiles = getLayerTiles(layer, object2ds);
    const backgroundLayer = createBackgroundLayer(scene, tiles, sprites, object2ds);
    scene.comp.layers.push(backgroundLayer);
    // scene.tileCollider.addGrid(grid);
  });
}

function setupObjects(land, scene, sprites, object2ds) {

}

function setupEntities(sceneSpec, scene, entityFactory) {
  // sceneSpec.entities.forEach(({ name, pos: [x, y] }) => {
  //   const createEntity = entityFactory[name];
  //   const entity = createEntity();
  //   entity.pos.set(x, y);
  //   scene.entities.push(entity);
  // });
  const spriteLayer = createSpriteLayer(scene.entities);
  scene.comp.layers.push(spriteLayer);
}

function setupTriggers(sceneSpec, scene) {
  if (!sceneSpec.triggers) {
    return;
  }

  for (const triggerSpec of sceneSpec.triggers) {
    const trigger = new Trigger();
    if (triggerSpec.type === 'goto') {
      trigger.conditions.push((entity, touches, gameContext, scene) => {
        scene.events.emit(
          WorldScene.EVENT_TRIGGER,
          triggerSpec,
          entity,
          touches,
        );
      });
    }
    const entity = new Entity();
    entity.addTrait(trigger);
    entity.pos.set(triggerSpec.pos[0], triggerSpec.pos[1]);
    entity.size.set(triggerSpec.size[0], triggerSpec.size[1]);
    scene.entities.push(entity);
  }
}

export function createWorldSceneLoader(entityFactory) {
  return function loadScene() {
    return loadJSON('http://localhost:3000/world.json')
      .then((worldSpec) =>
        Promise.all([
          worldSpec,
          loadSpriteSheets(worldSpec.sprites),
          loadObject2Ds(worldSpec.object2ds),
          // loadMusicSheet(sceneSpec.spriteSheet),
          // loadPatternSheet(sceneSpec.patternSheet),
        ]),
      )
      .then(([worldSpec, sprites, object2ds, musicPlayer]) => {
        return (scene) => {
          scene.music.setPlayer(musicPlayer);
          // setupTriggers(sceneSpec, scene);
          // setupBehavior(scene);
          return {
            async setupLand() {
              const land = await loadJSON(`http://localhost:3000${worldSpec.lands[0].pathname}`);
              setupBackgrounds(land, scene, sprites, object2ds);

            },
            async setupEntities() {
              setupEntities(worldSpec, scene, entityFactory);
            }
          };
        };
      });
  };
}

function getLayerTiles(layer, object2ds) {
  const matrix = new Matrix(layer.tiles);

  layer.object2ds.forEach(({ id, rect }) => {
    const object2d = object2ds[id];

    object2d.tiles.forEach((tile, x, y) => {
      const existedTile = matrix.get(rect[0] + x, rect[1] + y);
      if (existedTile) {
        matrix.set(rect[0] + x, rect[1] + y, [...existedTile, { pattern: object2d.id, index: [x, y] }]);
      }
    });
  });

  return matrix.grid;
}

function createGrid(tiles, patterns) {
  const grid = new Matrix();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, tile);
  }

  return grid;
}

function* expandSpan(xStart, xLen, yStart, yLen) {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;

  for (let x = xStart; x < xEnd; ++x) {
    for (let y = yStart; y < yEnd; ++y) {
      yield { x, y };
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
      for (const { x, y } of expandRanges(tile.ranges)) {
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
