import SpriteSheet from '@/js/SpriteSheet';
import { loadImage, loadLand } from '@/js/loaders';
import TexturedGrass_PNG from '@/img/MiniWorldSprites/Ground/TexturedGrass.png';

function drawBackground(background, context, sprites) {
  background.ranges.forEach(([x1, x2, y1, y2]) => {
    for (let x = x1; x < x2; ++x) {
      for (let y = y1; y < y2; ++y) {
        sprites.draw(background.tile, context, x * 16, y * 16);
      }
    }
  });
}

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');



loadImage(TexturedGrass_PNG)
  .then(image => {
    const sprites = new SpriteSheet(image, 16, 16);
    sprites.define('grass-4', 2, 1);
    sprites.define('grass-3', 2, 0);

    loadLand('1-1')
      .then(land => {
        land.backgrounds.forEach(background => {
          drawBackground(background, context, sprites)
        });
      });

    for (let x = 0; x < 25; ++x) {
      for (let y = 12; y < 14; ++y) {
        sprites.draw('grass-3', context, x * 16, y * 16);
      }
    }
  });