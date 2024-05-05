import Camera from '@/js/Camera';
import Timer from '@/js/Timer';
import { loadWorld } from '@/js/loaders/world';
import { loadRole } from '@/js/entities/Mario';
import { createCollisionLayer, createCameraLayer } from '@/js/layers';
import { setupKeyboard } from '@/js/input';
import { setupMouseControl } from '@/js/debug';

const debugMode = window.location.search.includes('debug=1')

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
  loadRole(),
  loadWorld('1-1')
]).then(([createRole, world]) => {
  const camera = new Camera();
  window.camera = camera;

  const role = createRole();
  role.pos.set(64, 64);
  world.entities.add(role);
  const input = setupKeyboard(role);
  input.listenTo(window);  

  if (debugMode) {
    world.comp.layers.push(
      createCollisionLayer(world),
      createCameraLayer(camera),
    );
    setupMouseControl(canvas, role, camera);
  }

  

  

  const timer = new Timer(1/60);

  timer.update = function update(deltaTime) {
    world.update(deltaTime);
    world.comp.draw(context, camera);
  }

  timer.start();
});
