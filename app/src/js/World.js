import Compositor from '@/js/Compositor';
import TileCollider from '@/js/TileCollider';
import EntityCollider from '@/js/EntityCollider';

export default class World {
  constructor() {
    this.totalTime = 0;

    this.comp = new Compositor();
    this.entities = [];

    this.entityCollider = new EntityCollider(this.entities);
    this.tileCollider = new TileCollider();
  }

  update(gameContext) {
    this.entities.forEach((entity) => {
      entity.update(gameContext, this);
    });

    this.entities.forEach((entity) => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach((entity) => {
      entity.finalize();
    });

    this.totalTime += gameContext.deltaTime;
  }
}