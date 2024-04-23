import Timer from '@/js/Timer';
import { loadLand } from '@/js/loaders';
import { createKanji } from '@/js/entities';
import { createCollisionLayer } from '@/js/layers';

import Keyboard from '@/js/KeyboardState';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
  createKanji(),
  loadLand('1-1')
]).then(([kanji, land]) => {
  const gravity = 2000;
  kanji.pos.set(64, 180);

  createCollisionLayer(land);

  land.entities.add(kanji);
 
  const SPACE = 32;
  const input = new Keyboard();
  input.addMapping(SPACE, (keyState) => {
    if (keyState) {
      kanji.jump.start();
    }
  });
  input.listenTo(window);

  ['mousedown', 'mousemove'].forEach((eventName) => {
    canvas.addEventListener(eventName, (event) => {
      if (event.buttons === 1) {
        kanji.vel.set(0, 0);
        kanji.pos.set(event.offsetX, event.offsetY);
      }
    });
  });

  const timer = new Timer(1/60);

  timer.update = function update(deltaTime) {
    land.update(deltaTime);
    land.comp.draw(context);
    kanji.vel.y += gravity * deltaTime;
  }

  timer.start();
});
