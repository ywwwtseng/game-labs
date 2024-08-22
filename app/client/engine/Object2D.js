import { Matrix } from '@/engine/math';

export default class Object2D {
  constructor({ id, tiles, anim }) {
    this.id = id;
    this.tiles = new Matrix(tiles);
    this.anim = anim 
      ? 
        {
          rate: anim.rate,
          frames: anim.frames.map((frame) => new Matrix(frame))
        } 
      : null;
  }

  drawTile(sprites, index, context, x, y) {
    this.tiles.get(...index)?.forEach((tile) => {
      sprites[tile.source].drawTile(tile.index, context, x, y);
    });
  }

  drawAnim(sprites, index, context, x, y, totalTime) {
    const frameLen =  (1 / 60) * (12 / this.anim.rate);
    const frameIndex = totalTime ? Math.floor(totalTime / frameLen) % this.anim.frames.length : 0;
    const frame = this.anim.frames[frameIndex];

    frame.get(...index)?.forEach((tile) => {
      sprites[tile.source].drawTile(tile.index, context, x, y);
    });
  }
}
