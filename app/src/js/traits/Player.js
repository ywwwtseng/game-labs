import { Trait } from '@/js/Entity';

export default class Player extends Trait {
  constructor() {
    super('player');
    // this.score = 0;
  }

  update(entity, { deltaTime }) {
    entity.pos.x += entity.vel.x * deltaTime;
    entity.pos.y += entity.vel.y * deltaTime;
  }
}