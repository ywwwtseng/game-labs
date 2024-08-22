import Object2D from '@/engine/Object2D';
import LegacyObject2D from '@/engine/LegacyObject2D';
import { loadJSON, loadImage } from '@/engine/loaders';
import { createAnim } from '@/engine/anim';

export function loadObject2Ds(object2dsSpec) {
  return object2dsSpec.reduce((object2ds, object2d) => {
    object2ds[object2d.id] = new Object2D(object2d);
    return object2ds;
  }, {});
}

export function loadObject2D(name) {
  return loadJSON(`sprites/${name}.json`)
    .then((sheetSpec) =>
      Promise.all([sheetSpec, loadImage(sheetSpec.imageURL)]),
    )
    .then(([sheetSpec, image]) => {
      const sprites = new LegacyObject2D(image, sheetSpec.tileW, sheetSpec.tileH);

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
            const animation = animSpec.status.reduce(
              (animation, direction, index) => {
                const frameLen =
                  typeof animSpec.frameLen === 'number'
                    ? animSpec.frameLen
                    : animSpec.frameLen[index];
                animation[direction] = createAnim(
                  animSpec.frames.map((frame) => `${frame}${direction}`),
                  frameLen,
                );
                return animation;
              },
              {},
            );

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
