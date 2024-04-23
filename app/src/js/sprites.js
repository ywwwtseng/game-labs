import SpriteSheet from '@/js/SpriteSheet';
import { loadImage } from '@/js/loaders';

export function loadKanjiSprite() {
  return loadImage('/img/MiniWorldSprites/Characters/Champions/Kanji.png')
    .then(image => {
      const sprites = new SpriteSheet(image, 16, 16);
      sprites.defineTile('idle', 0, 0);
      return sprites;
    });
}

export function loadBackgroundSprites() {
  return loadImage('/img/MiniWorldSprites/AllAssetsPreview.png')
    .then(image => {
      const sprites = new SpriteSheet(image, 16, 16);
      sprites.defineTile('land', 10, 16);
      sprites.defineTile('tree', 3, 15);
      return sprites;
    });
}