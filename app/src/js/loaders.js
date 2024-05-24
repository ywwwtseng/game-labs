import SpriteSheet from '@/js/SpriteSheet';
import { createAnim } from '@/js/anim';

export function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export function loadJSON(url) {
  return fetch(url)
    .then((r) => r.json());
}



export function loadSpriteSheet(name) {
  return loadJSON(`sprites/${name}.json`)
    .then((sheetSpec) => Promise.all([
      sheetSpec,
      loadImage(sheetSpec.imageURL),
    ]))
    .then(([sheetSpec, image]) => {
      const sprites = new SpriteSheet(
        image,
        sheetSpec.tileW,
        sheetSpec.tileH,
      );

      if (sheetSpec.tiles) {
        sheetSpec.tiles.forEach((tileSpec) => {
          sprites.defineTile(
            tileSpec.name,
            tileSpec.index[0],
            tileSpec.index[1],
          );
        });
      }

      if (sheetSpec.frames) {
        sheetSpec.frames.forEach((frameSpec) => {
          sprites.define(frameSpec.name, ...frameSpec.rect);
        });
      }

      if (sheetSpec.animations) {
        sheetSpec.animations.forEach((animSpec) => {
          if (animSpec.status) {
            const animation = animSpec.status.reduce((animation, direction, index) => {
              const frameLen = typeof animSpec.frameLen === 'number' ? animSpec.frameLen : animSpec.frameLen[index];
              animation[direction] = createAnim(animSpec.frames.map((frame) => `${frame}${direction}`), frameLen);
              return animation;
            }, {});

            sprites.defineAnim(animSpec.name, animation);
          } else {
            const animation = createAnim(animSpec.frames, animSpec.frameLen);
            sprites.defineAnim(animSpec.name, animation);
          }
        });
      }

      return sprites;
    });
}
