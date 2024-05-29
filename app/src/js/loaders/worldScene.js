import { Matrix } from '@/engine/math';
import Entity from '@/engine/Entity';
import { createBackgroundLayer } from '@/engine/layers/background';
import { createSpriteLayer } from '@/engine/layers/sprites';
import { loadMusicSheet } from '@/engine/loaders/music';
import { loadSpriteSheet } from '@/engine/loaders/sprite';
import { loadJSON } from '@/engine/loaders';

import SceneTimer from '@/js/traits/SceneTimer';
import Trigger from '@/js/traits/Trigger';
import WorldScene from '@/js/scenes/WorldScene';


function createTimer() {
  const timer = new Entity();
  timer.addTrait(new SceneTimer());
  return timer;
}

function createTrigger() {
  const entity = new Entity();
  entity.addTrait(new Trigger());
  return entity;
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

function setupBackgrounds(sceneSpec, scene, sceneSprites, patterns) {
  sceneSpec.layers.forEach((layer) => {
    const grid = createGrid(layer.tiles, patterns);
    const backgroundLayer = createBackgroundLayer(scene, grid, sceneSprites);
    scene.comp.layers.push(backgroundLayer);
    scene.tileCollider.addGrid(grid);
  });
}

function setupEntities(sceneSpec, scene, entityFactory) {
  sceneSpec.entities.forEach(({name, pos: [x, y]}) => {
    const createEntity = entityFactory[name];
    const entity = createEntity();
    entity.pos.set(x, y);
    scene.entities.push(entity);
  });
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
        scene.events.emit(WorldScene.EVENT_TRIGGER, triggerSpec, entity, touches);
      });
    }
    const entity = new Entity();
    entity.addTrait(trigger);
    entity.pos.set(triggerSpec.pos[0], triggerSpec.pos[1]);
    entity.size.set(triggerSpec.size[0], triggerSpec.size[1]);
    scene.entities.push(entity);
  }
}

export function createSceneLoader(entityFactory) {
  return function loadScene(name) {
    return loadJSON(`/scene/${name}.json`)
      .then((sceneSpec) => Promise.all([
        sceneSpec,
        loadSpriteSheet(sceneSpec.spriteSheet),
        loadMusicSheet(sceneSpec.spriteSheet),
        loadPatternSheet(sceneSpec.patternSheet),
      ]))
      .then((([sceneSpec, sceneSprites, musicPlayer, patterns]) => {
      const scene = new WorldScene();
      scene.name = name;
      scene.music.setPlayer(musicPlayer);

      setupBackgrounds(sceneSpec, scene, sceneSprites, patterns);
      setupEntities(sceneSpec, scene, entityFactory, sceneSprites);
      setupTriggers(sceneSpec, scene);
      setupBehavior(scene);

      return scene;
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
