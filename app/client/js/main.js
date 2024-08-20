import Dimensions from '@/engine/Dimensions';
import Timer from '@/engine/Timer';
import { loadFont } from '@/engine/loaders/fonts';
import { createColorLayer } from '@/engine/layers/color';
import { createCollisionLayer } from '@/engine/layers/collision';
import { createCameraLayer } from '@/engine/layers/camera';
import { FRAME_DURATION } from '@/engine/constants';
import SceneManager from '@/engine/SceneManager';
import Scene from '@/engine/Scene';

import { createPlayerEnv, makePlayer, findPlayers } from '@/js/helpers/player';
import { loadEntities } from '@/js/entities';
import { setupKeyboard, setupJoystick } from '@/js/input';
import { setupMouseControl } from '@/js/debug';
import WorldScene from '@/js/scenes/WorldScene';
import LoadingScene from '@/js/scenes/LoadingScene';
import Player from '@/js/traits/Player';
import SocketClient from '@/js/SocketClient';
import { debugMode } from '@/js/env';

async function main(canvas) {
  const videoContext = canvas.getContext('2d', { alpha: false });
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const player = makePlayer(entityFactory.role(), 'PLAYER');

  const inputRouter =
    !debugMode && 'ontouchstart' in window
      ? setupJoystick(window)
      : setupKeyboard(window);

  inputRouter.addReceiver(player);

  const gameContext = {
    font,
    canvas,
    player,
    audioContext,
    videoContext,
    entityFactory,
    deltaTime: null,
    timestamp: null,
  };

  const ws = new SocketClient();

  ws.listen('timestamp', (data) => {
    gameContext.timestamp = data;
  });

  const sceneManager = new SceneManager(gameContext);

  async function runScene(name) {
    await sceneManager.loadScene('loading', LoadingScene, {
      text: `Loading ${name}`,
    });
    sceneManager.runScene('loading');
    await sceneManager.loadScene(name, WorldScene);
    sceneManager.runScene(name);
  }

  const timer = new Timer(FRAME_DURATION);

  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;
    sceneManager.update(gameContext);
  };

  timer.start();
  runScene('world');
  window.runScene = runScene;
}

const canvas = document.getElementById('screen');

const start = (event) => {
  main(canvas);
  canvas.width = Dimensions.get('canvas').width;
  canvas.height = Dimensions.get('canvas').height;
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
  canvas.width = Dimensions.get('canvas').width;
  canvas.height = Dimensions.get('canvas').height;
});
