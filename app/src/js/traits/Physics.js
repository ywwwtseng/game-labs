import { Trait } from '@/js/Entity';

export default class Physics extends Trait {
  constructor() {
    super('physics');
  }

  update(entity, gameContext, scene) {
    const { deltaTime } = gameContext;
    entity.pos.x += entity.vel.x * deltaTime;
    scene.tileCollider.checkX(entity, gameContext, scene);

    entity.pos.y += entity.vel.y * deltaTime;
    scene.tileCollider.checkY(entity, gameContext, scene);
  }
}