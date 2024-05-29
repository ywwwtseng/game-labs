import Trait from '@/engine/Trait';
import { Vec2 } from '@/engine/math';
import { DIRECTION, DEGREE } from '@/engine/constants';

import Solid from '@/js/traits/Solid';

export default class Go extends Trait {
  constructor() {
    super();
    this.dir = new Vec2(0, 0);
    this.speed = 6000;

    this.distance = new Vec2(0, 0);
    this.heading = DIRECTION.DOWN;
    this.touched = false;
  }
  
  collides(us, them) {
    if (
      !(us.traits.has(Solid) && us.traits.get(Solid).obstructs)
      || !(them.traits.has(Solid) && them.traits.get(Solid).obstructs)
    ) {
      return;
    }

    const dir = them.bounds.center.clone().sub(us.bounds.center).dir();

    if (dir >= DEGREE[45] && dir < DEGREE[135]) {
      us.bounds.bottom = them.bounds.top;
    } else if (dir >= DEGREE[315] && dir < DEGREE[45]) {
      us.bounds.right = them.bounds.left;
    } else if (dir >= DEGREE[225] && dir < DEGREE[315]) {
      us.bounds.top = them.bounds.bottom;
    } else {
      us.bounds.left = them.bounds.right;
    }
  }

  update(entity, { deltaTime }) {
    entity.vel.x = this.speed * this.dir.x * deltaTime;
    entity.vel.y = this.speed * this.dir.y * deltaTime;

    if (this.dir.length() > 0) {
      const dir = this.dir.dir();

      if (dir >= DEGREE[67.5] && dir < DEGREE[112.5]) {
        this.heading = DIRECTION.DOWN;
      } else if (dir >= DEGREE[292.5] && dir < DEGREE[67.5]) {
        this.heading = DIRECTION.RIGHT;
      } else if (dir >= DEGREE[247.5] && dir < DEGREE[292.5]) {
        this.heading = DIRECTION.UP;
      } else {
        this.heading = DIRECTION.LEFT;
      }
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
