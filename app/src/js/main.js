import Camera from '@/js/Camera';
import Timer from '@/js/Timer';
import { loadWorld } from '@/js/loaders';
import { createKanji } from '@/js/entities';
import { createCollisionLayer, createCameraLayer } from '@/js/layers';
import { setupKeyboard } from '@/js/input';
import { setupMouseControl } from '@/js/debug';

const debugMode = window.location.search.includes('debug=1')

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
  createKanji(),
  loadWorld('1-1')
]).then(([kanji, world]) => {
  const camera = new Camera();
  window.camera = camera;

  if (debugMode) {
    world.comp.layers.push(
      createCollisionLayer(world),
      createCameraLayer(camera),
    );
    setupMouseControl(canvas, kanji, camera);
  }

  kanji.pos.set(64, 64);
  kanji.size.set(16, 16);
  world.entities.add(kanji);
 
  const input = setupKeyboard(kanji);
  input.listenTo(window);  

  const timer = new Timer(1/60);

  timer.update = function update(deltaTime) {
    world.update(deltaTime);
    world.comp.draw(context, camera);
  }

  timer.start();
});
