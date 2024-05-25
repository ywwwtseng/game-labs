import { Trait } from '@/js/Entity';

export default class Physics extends Trait {
  constructor() {
    super('physics');
  }

  update(entity, gameContext, world) {
    const { deltaTime } = gameContext;
    entity.pos.x += entity.vel.x * deltaTime;
    world.tileCollider.checkX(entity, gameContext, world);

    entity.pos.y += entity.vel.y * deltaTime;
    world.tileCollider.checkY(entity, gameContext, world);
  }
}