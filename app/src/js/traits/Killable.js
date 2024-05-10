import { Trait } from '@/js/Entity';

export default class Killable extends Trait {
  constructor() {
    super('killable');

    this.dead = false;
    this.deadTime = 0;
    this.removeAfter = 2;
  }

  kill() {
    this.queue(() => this.dead = true);
  }

  revive() {
    this.dead = false;
    this.deadTime = 0;
  }

  update(entity, deltaTime, world) {
    if (this.dead) {
      this.deadTime += deltaTime;
      if (this.deadTime > this.removeAfter) {
        this.queue(() => {
          world.entities.delete(entity);
        });
      }
    }
  }
}