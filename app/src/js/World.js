import Compositor from '@/js/Compositor';
import TileCollider from '@/js/TileCollider';
import { Matrix } from '@/js/math';

export default class World {
  constructor() {
    // this.gravity = 2000;
    this.totalTime = 0;

    this.comp = new Compositor();
    this.entities = new Set();
    this.tiles = new Matrix();

    this.tileCollider = new TileCollider(this.tiles);
  }

  update(deltaTime) {
    this.entities.forEach((entity) => {
      entity.update(deltaTime);

      entity.pos.x += entity.vel.x * deltaTime;
      this.tileCollider.checkX(entity);
      entity.pos.y += entity.vel.y * deltaTime;
      this.tileCollider.checkY(entity);
      // entity.vel.z += this.gravity * deltaTime;

      this.totalTime += deltaTime;
    });
  }
}