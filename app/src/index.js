import Compositor from '@/js/Compositor';
import Timer from '@/js/Timer';
import { loadLand } from '@/js/loaders';
import { createKanji } from '@/js/entities';
import { loadBackgroundSprites } from '@/js/sprites';
import { createBackgroundLayer } from '@/js/layers';
import Entity from '@/js/Entity';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

function createSpriteLayer(entity) {
  return function drawSpriteLayer(context) {
    entity.draw(context);
  };
}

Promise.all([
  createKanji(),
  loadBackgroundSprites(),
  loadLand('1-1')
]).then(([kanji, backgroundSprites, land]) => {
  const comp = new Compositor();

  const backgroundLayer = createBackgroundLayer(land.backgrounds, backgroundSprites);
  comp.layers.push(backgroundLayer);


  const gravity = 2000;
  kanji.pos.set(64, 180);
  kanji.vel.set(200, -600);


  const spriteLayer = createSpriteLayer(kanji);
  comp.layers.push(spriteLayer);

  const timer = new Timer(1/60);

  timer.update = function update(deltaTime) {
    kanji.update(deltaTime);
    comp.draw(context);
    kanji.vel.y += gravity * deltaTime;
  }

  timer.start();
});
