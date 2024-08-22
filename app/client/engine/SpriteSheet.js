import { Matrix } from '@/engine/math';

export default class SpriteSheet {
  constructor(image, width, height) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.tiles = new Matrix();

    for (let x = 0; x < image.naturalWidth / this.width; x++) {
      for (let y = 0; y < image.naturalHeight / this.width; y++) {
        const buffer = this.createTileBuffer(x, y);
        this.tiles.set(x, y, buffer);
      }
    }
  }

  createTileBuffer(x, y) {
    const buffer = document.createElement('canvas');
    buffer.width = this.width;
    buffer.height = this.height;
    buffer
      .getContext('2d')
      .drawImage(
        this.image,
        x * this.width,
        y * this.height,
        this.width,
        this.height,
        0,
        0,
        this.width,
        this.height
      );

    return buffer;
  }

  drawTile(index, context, x, y) {
    context.drawImage(
      this.tiles.get(...index),
      x * this.width,
      y * this.height,
    );
  }
}
