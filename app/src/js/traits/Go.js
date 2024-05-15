import { Trait } from '@/js/Entity';
import { Vec2 } from '@/js/math';
import { DIRECTION } from '@/js/constants';

export default class Go extends Trait {
  constructor() {
    super('go');

    this.dir = new Vec2(0, 0);
    this.speed = 6000;

    this.distance = new Vec2(0, 0);
    this.heading = DIRECTION.DOWN;
    this.touched = false;
  }
  
  collides(us, them) {
    const dir = them.bounds.center.clone().sub(us.bounds.center).dir();

    if (dir >= Math.atan2(1, 1) && dir < Math.atan2(1, -1)) {
      us.bounds.bottom = them.bounds.top;
    } else if (dir >= Math.atan2(-1, 1) && dir < Math.atan2(1, 1)) {
      us.bounds.right = them.bounds.left;
    } else if (dir >= Math.atan2(-1, -1) && dir < Math.atan2(-1, 1)) {
      us.bounds.top = them.bounds.bottom;
    } else {
      us.bounds.left = them.bounds.right;
    }
  }

  update(entity, { deltaTime }) {
    entity.vel.x = this.speed * this.dir.x * deltaTime;
    entity.vel.y = this.speed * this.dir.y * deltaTime;

    if (this.dir.y) {
      this.heading = this.dir.y > 0 ? DIRECTION.DOWN : DIRECTION.UP;
    } else if (this.dir.x) {
      this.heading = this.dir.x > 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
    }

    

    if (this.dir.x) {
      this.distance.x += Math.abs(entity.vel.x) * deltaTime;
    } else {
      this.distance.x = 0;
    }

    if (this.dir.y) {
      this.distance.y += Math.abs(entity.vel.y) * deltaTime;
    } else {
      this.distance.y = 0;
    }
  }
}
