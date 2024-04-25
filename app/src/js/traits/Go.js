import { Trait } from '@/js/Entity';
import { Vec2 } from '@/js/math';
import { DIRECTION } from '@/js/constants';

export default class Go extends Trait {
  constructor() {
    super('go');

    this.dir = DIRECTION.NONE;
    this.speed = 6000;

    this.distance = new Vec2(0, 0);
    this.heading = DIRECTION.DOWN;
  }

  update(entity, deltaTime) {
    if (this.dir !== DIRECTION.NONE) {
      this.heading = this.dir;
    }

    if (this.dir === DIRECTION.NONE) {
      entity.vel.x = 0;
      entity.vel.y = 0;
    } else if (this.dir === DIRECTION.UP) {
      entity.vel.y = -this.speed * deltaTime;
    } else if (this.dir === DIRECTION.DOWN) {
      entity.vel.y = this.speed * deltaTime;
    } else if (this.dir === DIRECTION.LEFT) {
      entity.vel.x = -this.speed * deltaTime;
    } else if (this.dir === DIRECTION.RIGHT) {
      entity.vel.x = this.speed * deltaTime;
    }

    if (this.dir === DIRECTION.NONE) {
      this.distance.x = 0;
      this.distance.y = 0;
    } else {
      this.distance.x += Math.abs(entity.vel.x) * deltaTime;
      this.distance.y += Math.abs(entity.vel.y) * deltaTime;
    }

  }
}
