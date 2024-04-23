import Land from '@/js/Land';
import { createBackgroundLayer, createSpriteLayer } from '@/js/layers';
import { loadBackgroundSprites } from '@/js/sprites';

export function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

function createTiles(land, backgrounds) {
  backgrounds.forEach((background) => {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
      for (let x = x1; x < x2; ++x) {
        for (let y = y1; y < y2; ++y) {
          land.tiles.set(x, y, {
            name: background.tile
          });
        }
      }
    }); 
  });
}

export function loadLand(name) {
  return Promise.all([
    fetch(`/land/${name}.json`).then((r) => r.json()),
    loadBackgroundSprites(),
  ]).then((([landSpec, backgroundSprites]) => {
    const land = new Land();

    createTiles(land, landSpec.backgrounds);

    const backgroundLayer = createBackgroundLayer(land, backgroundSprites);
    land.comp.layers.push(backgroundLayer);

    const spriteLayer = createSpriteLayer(land.entities);
    land.comp.layers.push(spriteLayer);

    return land;
  }));
}
