import Timer from '@/js/Timer';
import { loadLand } from '@/js/loaders';
import { createKanji } from '@/js/entities';
import { createCollisionLayer } from '@/js/layers';
import { setupKeyboard } from '@/js/input';

const debugMode = window.location.search.includes('debug=1')

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
  createKanji(),
  loadLand('1-1')
]).then(([kanji, land]) => {
  if (debugMode) {
    land.comp.layers.push(createCollisionLayer(land));

    ['mousedown', 'mousemove'].forEach((eventName) => {
      canvas.addEventListener(eventName, (event) => {
        if (event.buttons === 1) {
          kanji.vel.set(0, 0);
          kanji.pos.set(event.offsetX, event.offsetY);
        }
      });
    });
  }

  kanji.pos.set(64, 64);
  kanji.size.set(16, 16);
  land.entities.add(kanji);
 
  const input = setupKeyboard(kanji);
  input.listenTo(window);  

  const timer = new Timer(1/60);

  timer.update = function update(deltaTime) {
    land.update(deltaTime);
    land.comp.draw(context);
  }

  timer.start();
});
