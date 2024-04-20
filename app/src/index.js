import Compositor from '@/js/Compositor';
import { loadLand } from '@/js/loaders';
import { loadKanjiSprite, loadBackgroundSprites } from '@/js/sprites';
import { createBackgroundLayer } from '@/js/layers';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

function createSpriteLayer(sprite, pos) {
  return function drawSpriteLayer(context) {
    sprite.draw('idle', context, pos.x, pos.y);
  };
}

Promise.all([
  loadKanjiSprite(),
  loadBackgroundSprites(),
  loadLand('1-1')
]).then(([kanjiSprite, backgroundSprites, land]) => {
  const comp = new Compositor();

  const backgroundLayer = createBackgroundLayer(land.backgrounds, backgroundSprites);
  comp.layers.push(backgroundLayer);

  const pos = {
    x: 16,
    y: 16,
  }

  const spriteLayer = createSpriteLayer(kanjiSprite, pos);
  comp.layers.push(spriteLayer);

  function update() {
    comp.draw(context);
    pos.x +=2;
    pos.y2 +=2
    requestAnimationFrame(update);
  }

  update();
});
