import { Trait } from '@/js/Entity';

export default class Attack extends Trait {
  constructor() {
    super('attack');

    this.engageTime = 0;
    this.duration = 0.06666666666666667 * 7;
  }

  get lifetime() {
    if (this.engageTime === 0) {
      return 0;
    }

    return this.duration - this.engageTime;
  }

  start() {
    this.engageTime = this.duration;
  }

  stop() {
    this.engageTime = 0;
  }

  update(entity, deltaTime) {
    if (this.engageTime > 0) {
      this.engageTime = Math.max(this.engageTime - deltaTime, 0);
    }
  }
}
