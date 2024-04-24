import { Trait } from '@/js/Entity';

export const DIRECTION = {
  NONE: -1,
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

export default class Go extends Trait {
  constructor() {
    super('go');

    this.dir = DIRECTION.NONE;
    this.speed = 6000;
  }

  update(entity, deltaTime) {
    if (this.dir === DIRECTION.NONE) {
      entity.vel.x = 0;
      entity.vel.y = 0;
    } else if (this.dir === DIRECTION.UP) {
      entity.vel.y = - this.speed * deltaTime;
    } else if (this.dir === DIRECTION.DOWN) {
      entity.vel.y = this.speed * deltaTime;
    } else if (this.dir === DIRECTION.LEFT) {
      entity.vel.x = - this.speed * deltaTime;
    } else if (this.dir === DIRECTION.RIGHT) {
      entity.vel.x = this.speed * deltaTime;
    }
  }
}
