import Camera from '@/js/Camera';
import Entity from '@/js/Entity';
import PlayerController from '@/js/traits/PlayerController';
import Timer from '@/js/Timer';
import { loadWorldLoader } from '@/js/loaders/world';
import { loadEntities } from '@/js/entities/entities';
import { createCollisionLayer, createCameraLayer } from '@/js/layers';
import { setupKeyboard } from '@/js/input';
import { setupMouseControl } from '@/js/debug';

function createPlayerEnv(playerEntity) {
  const playerEnv = new Entity();
  const playerControl = new PlayerController();
  playerControl.checkpoint.set(151 * 16, 151 * 16);
  playerControl.setPlayer(playerEntity);
  playerEnv.addTrait(playerControl);
  return playerEnv;
}

async function main(canvas) {
  const context = canvas.getContext('2d');
  const entityFactory = await loadEntities();
  const loadWorld = loadWorldLoader(entityFactory);
  const world = await loadWorld('1-1');

  const camera = new Camera();

  const character = entityFactory.character();
  character.pos.set(151 * 16, 151 * 16);
  world.entities.add(character);

  const playerEnv = createPlayerEnv(character);
  world.entities.add(playerEnv);

  const input = setupKeyboard(character);
  input.listenTo(window);  

  if (debugMode) {
    world.comp.layers.push(
      createCollisionLayer(world),
      createCameraLayer(camera),
    );
    setupMouseControl(canvas, character, camera);
  }

  const timer = new Timer(1/60);

  timer.update = function update(deltaTime) {
    world.update(deltaTime);

    camera.pos.x = character.pos.x - camera.size.x / 2 + character.size.x / 2;
    camera.pos.y = character.pos.y - camera.size.y / 2 + character.size.y / 2;

    world.comp.draw(context, camera);
  }

  timer.start();
}

const debugMode = window.location.search.includes('debug=1')
const canvas = document.getElementById('screen');
main(canvas);

