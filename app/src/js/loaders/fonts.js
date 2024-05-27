import SpriteSheet from '@/js/SpriteSheet';
import Dimensions from '@/js/Dimensions';
import { loadImage } from '@/js/loaders.js';

const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

class Font {
  constructor(sprites, size) {
    this.sprites = sprites;
    this.size = size;
  }

  print(text, context, x, y) {
    [...text].forEach((char, pos) => {

      this.sprites.draw(
        char,
        context,
        Dimensions.get('canvas').offset.x + x + pos * this.size,
        Dimensions.get('canvas').offset.y + y
      );
    });
  }
}

export function loadFont() {
  return loadImage('./img/font.png')
    .then(image => {
      const fontSprite = new SpriteSheet(image);

      const size = 8;
      const rowLen = image.width;
      for (let [index, char] of [...CHARS].entries()) {
        const x = index * size % rowLen;
        const y = Math.floor(index * size / rowLen) * size;
        fontSprite.define(char, x, y, size, size);
      }

      return new Font(fontSprite, size);
    });
}