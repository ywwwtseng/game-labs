import Camera from '@/js/Camera';
import Timer from '@/js/Timer';
import { loadWorld } from '@/js/loaders/world';
import { loadCharacter } from '@/js/entities/Character';
import { createCollisionLayer, createCameraLayer } from '@/js/layers';
import { setupKeyboard } from '@/js/input';
import { setupMouseControl } from '@/js/debug';

const debugMode = window.location.search.includes('debug=1')

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
  loadCharacter(),
  loadWorld('1-1')
]).then(([createCharacter, world]) => {
  const camera = new Camera();
  window.camera = camera;

  const character = createCharacter();
  character.pos.set(151 * 16, 151 * 16);
  world.entities.add(character);
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
