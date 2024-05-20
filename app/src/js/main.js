import Dimensions from '@/js/Dimensions';
import Camera from '@/js/Camera';
import Entity from '@/js/Entity';
import PlayerController from '@/js/traits/PlayerController';
import Timer from '@/js/Timer';
import { createWorldLoader } from '@/js/loaders/world';
import { loadEntities } from '@/js/entities';
import { loadFont } from '@/js/loaders/fonts';
import { setupKeyboard, setupJoystick } from '@/js/input';
import { createCollisionLayer } from '@/js/layers/collision';
import { createCameraLayer } from '@/js/layers/camera';
import { createDashboardLayer } from '@/js/layers/dashboard';
import { setupMouseControl } from '@/js/debug';
import { FRAME_DURATION } from '@/js/constants';

function createPlayerEnv(playerEntity) {
  const playerEnv = new Entity();
  const playerControl = new PlayerController();
  playerControl.checkpoint.set(151 * 16, 151 * 16);
  playerControl.setPlayer(playerEntity);
  playerEnv.addTrait(playerControl);
  return playerEnv;
}

async function main(canvas) {
  const context = canvas.getContext('2d', { alpha: false });
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadWorld = createWorldLoader(entityFactory);

  const world = await loadWorld('1-1');

  const camera = new Camera();

  const player = entityFactory.player();
  player.pos.set(151 * 16, 151 * 16);
  world.entities.unshift(player);

  const playerEnv = createPlayerEnv(player);
  world.entities.unshift(playerEnv);

  if ('ontouchstart' in window) {
    setupJoystick(player);

    if (debugMode) {
      const input = setupKeyboard(player);
      input.listenTo(window);
    }
  } else {
    const input = setupKeyboard(player);
    input.listenTo(window);
  }

  

  if (debugMode) {
    world.comp.layers.push(
      createCollisionLayer(world),
      createCameraLayer(camera),
    );
    setupMouseControl(canvas, player, camera);
  }

  // world.comp.layers.push(createDashboardLayer(font, playerEnv));

  const gameContext = {
    audioContext,
    deltaTime: null,
  };

  const timer = new Timer(FRAME_DURATION);

  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;

    world.update(gameContext);

    camera.pos.x = Math.floor(player.pos.x - camera.size.x / 2 + player.size.x / 2);
    camera.pos.y = Math.floor(player.pos.y - camera.size.y / 2 + player.size.y / 2);

    world.comp.draw(context, camera);
  }

  timer.start();
}

const debugMode = window.location.search.includes('debug=1')
const canvas = document.getElementById('screen');
canvas.width = Dimensions.get('screen').width;
canvas.height = Dimensions.get('screen').height;

const start = (event) => {
  main(canvas);
  event.target.remove();
};

const button = document.createElement('button');
button.innerText = 'START';
button.style.position = 'fixed';
button.style.width = '100px';
button.style.height = '40px';
button.style.top = '0px';
button.style.bottom = '0px';
button.style.right = '0px';
button.style.left = '0px';
button.style.margin = 'auto';
button.style.backgroundColor = 'black';
button.style.color = 'white';
document.body.appendChild(button);
button.addEventListener('click', start);

window.addEventListener('resize', (event) => {
  canvas.width = Dimensions.get('screen').width;
  canvas.height = Dimensions.get('screen').height;
});
