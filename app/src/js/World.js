import Compositor from '@/js/Compositor';
import TileCollider from '@/js/TileCollider';
import EntityCollider from '@/js/EntityCollider';

export default class World {
  constructor() {
    // this.gravity = 2000;
    this.totalTime = 0;

    this.comp = new Compositor();
    this.entities = new Set();

    this.entityCollider = new EntityCollider(this.entities);
    this.tileCollider = null;
  }

  setCollisionGird(matrix) {
    this.tileCollider = new TileCollider(matrix);
  }

  update(deltaTime) {
    this.entities.forEach((entity) => {
      entity.update(deltaTime);

      entity.pos.x += entity.vel.x * deltaTime;
      this.tileCollider.checkX(entity);
      entity.pos.y += entity.vel.y * deltaTime;
      this.tileCollider.checkY(entity);

      this.entityCollider.check(entity);
      // entity.vel.z += this.gravity * deltaTime;

      
    });

    this.totalTime += deltaTime;
  }
}