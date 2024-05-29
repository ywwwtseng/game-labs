import Dimensions from '@/engine/Dimensions';
import Timer from '@/engine/Timer';
import { loadFont } from '@/engine/loaders/fonts';
import { createColorLayer } from '@/engine/layers/color';
import { createCollisionLayer } from '@/engine/layers/collision';
import { createCameraLayer } from '@/engine/layers/camera';
import { createTextLayer } from '@/engine/layers/text';
import { FRAME_DURATION } from '@/engine/constants';
import SceneRunner from '@/engine/SceneRunner';
import Scene from '@/engine/Scene';

import { createDashboardLayer } from '@/js/layers/dashboard';
import { createPlayerProgressLayer } from '@/js/layers/player-progress';
import { createSceneLoader } from '@/js/loaders/worldScene';
import { createPlayerEnv, makePlayer, findPlayers } from '@/js/helpers/player';
import { loadEntities } from '@/js/entities';
import { setupKeyboard, setupJoystick } from '@/js/input';
import { setupMouseControl } from '@/js/debug';
import WorldScene from '@/js/scenes/WorldScene';
import TimedScene from '@/js/scenes/TimedScene';
import Player from '@/js/traits/Player';


async function main(canvas) {
  const videoContext = canvas.getContext('2d', { alpha: false });
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadScene = createSceneLoader(entityFactory);

  const sceneRunner = new SceneRunner();

  const player = makePlayer(entityFactory.role(), 'PLAYER');

  let inputRouter;

  if (debugMode) {
    inputRouter = setupKeyboard(window);
  } else if ('ontouchstart' in window) {
    inputRouter = setupJoystick(window);
  } else {
    inputRouter = setupKeyboard(window);
  }

  inputRouter.addReceiver(player);

  async function runScene(name) {
    const loadScreen = new Scene();
    loadScreen.comp.layers.push(createColorLayer('#000'));
    loadScreen.comp.layers.push(createTextLayer(font, `Loading ${name}`));

    sceneRunner.addScene(loadScreen);
    sceneRunner.runNext();
    const scene = await loadScene(name);
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    scene.events.listen(WorldScene.EVENT_TRIGGER, (spec, trigger, touches) => {
      if (spec.type === 'goto') {
        for (const _ of findPlayers(touches)) {
          runScene(spec.name);
          return;
        }
      }
      
    });

    const playerProgressLayer = createPlayerProgressLayer(font, scene);
    const dashboardLayer = createDashboardLayer(font, scene);

    const playerEnv = createPlayerEnv(player);
    scene.entities.unshift(playerEnv);

    // wait scene need player trait data, so we need add player into scene.
    scene.entities.unshift(player);


    const waitScene = new TimedScene();
    waitScene.comp.layers.push(createColorLayer('#000'));
    waitScene.comp.layers.push(dashboardLayer);
    waitScene.comp.layers.push(playerProgressLayer);
    sceneRunner.addScene(waitScene);

    if (debugMode) {
      scene.comp.layers.push(
        createCollisionLayer(scene),
        createCameraLayer(scene.camera),
      );
      setupMouseControl(canvas, player, scene.camera);
    }

    scene.comp.layers.push(dashboardLayer);
    sceneRunner.addScene(scene);

    sceneRunner.runNext();
  }

  const gameContext = {
    audioContext,
    videoContext,
    entityFactory,
    deltaTime: null,
  };

  const timer = new Timer(FRAME_DURATION);

  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  }

  timer.start();
  runScene('world');
  window.runScene = runScene;
}

const debugMode = window.location.search.includes('debug=1')
const canvas = document.getElementById('screen');
canvas.width = Dimensions.get('canvas').width;
canvas.height = Dimensions.get('canvas').height;

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
  canvas.width = Dimensions.get('canvas').width;
  canvas.height = Dimensions.get('canvas').height;
});
