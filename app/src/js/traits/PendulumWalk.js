import { Trait } from '@/js/Entity';

export default class PendulumWalk extends Trait {
  constructor() {
    super('pendulumWalk');

    this.speed = 10;
    this.distance = 0;
  }

  cancel() {
    this.engageTime = 0;
  }

  update(entity, deltaTime) {
    if (entity.vel.x === 0) {
      entity.vel.x = this.speed;
    } else if (Math.abs(this.distance) > 15) {
      entity.vel.x = -entity.vel.x;
    }

    this.distance += entity.vel.x * deltaTime;
  }
}
