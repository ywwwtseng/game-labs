import { Trait } from '@/js/Entity';

export default class PendulumMove extends Trait {
  constructor() {
    super('pendulumMove');

    this.speed = 10;
    this.distance = 0;
    this.lifetime = 0;
    this.enable = true;
  }

  update(entity, { deltaTime }) {
    if (this.enable) {
      if (entity.vel.x === 0) {
        entity.vel.x = this.speed;
      } else if (Math.abs(this.distance) > 15) {
        entity.vel.x = -entity.vel.x;
        this.speed = entity.vel.x;
      }
      
      this.distance += entity.vel.x * deltaTime;
      this.lifetime += deltaTime;
    } else {
      if (entity.vel.x !== 0) {
        entity.vel.x = 0;
      }
    }
  }
}
