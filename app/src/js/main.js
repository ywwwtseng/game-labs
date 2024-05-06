import Camera from '@/js/Camera';
import Timer from '@/js/Timer';
import { loadWorld } from '@/js/loaders/world';
import { loadEntities } from '@/js/entities/entities';
import { createCollisionLayer, createCameraLayer } from '@/js/layers';
import { setupKeyboard } from '@/js/input';
import { setupMouseControl } from '@/js/debug';

const debugMode = window.location.search.includes('debug=1')

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
  loadEntities(),
  loadWorld('1-1')
]).then(([factory, world]) => {
  const camera = new Camera();
  window.camera = camera;

  const character = factory.character();
  character.pos.set(151 * 16, 151 * 16);
  world.entities.add(character);

  const chicken = factory.chicken();
  chicken.pos.set(151 * 16, 153 * 16);
  world.entities.add(chicken);

  
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
});
