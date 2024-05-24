import { Trait } from '@/js/Entity';

export default class Physics extends Trait {
  constructor() {
    super('physics');
  }

  update(entity, { deltaTime }, world) {
    entity.pos.x += entity.vel.x * deltaTime;
    world.tileCollider.checkX(entity);

    entity.pos.y += entity.vel.y * deltaTime;
    world.tileCollider.checkY(entity);
  }
}