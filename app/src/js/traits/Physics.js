import { Trait } from '@/js/Entity';

export default class Physics extends Trait {
  constructor() {
    super('physics');
  }

  update(entity, deltaTime, level) {
    entity.pos.x += entity.vel.x * deltaTime;
    level.tileCollider.checkX(entity);

    entity.pos.y += entity.vel.y * deltaTime;
    level.tileCollider.checkY(entity);
  }
}