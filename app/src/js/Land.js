import Compositor from '@/js/Compositor';
import TileCollider from '@/js/TileCollider';
import { Matrix } from '@/js/math';

export default class Land {
  constructor() {
    this.comp = new Compositor();
    this.entities = new Set();
    this.tiles = new Matrix();

    this.tileCollider = new TileCollider(this.tiles);
  }

  update(deltaTime) {
    this.entities.forEach((entity) => {
      entity.update(deltaTime);

      this.tileCollider.test(entity);
    });
  }
}