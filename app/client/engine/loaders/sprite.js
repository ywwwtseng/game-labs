import SpriteSheet from '@/engine/SpriteSheet';
import { loadImage } from '@/engine/loaders';

export function loadSpriteSheets(sheetsSpec) {
  return Promise.all(
    sheetsSpec.map((sheetSpec) => loadImage(`http://localhost:3000${sheetSpec.file}`)))
      .then((images) => {
        return images.reduce((sprites, image, index) => {
          sprites[sheetsSpec[index].id] = new SpriteSheet(image, 16, 16);
          return sprites;
        }, {});
      });
}
