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
    if (this.engageTime === 0) {
      this.engageTime = this.duration;
      this.sounds.add('attack');
    }
  }

  stop() {
    this.engageTime = 0;
  }

  collides(us, them) {
    if (this.engageTime > 0) {
      console.log(us, them);
    }
  }

  update(entity, { deltaTime }, world) {
    if (this.engageTime > 0) {
      this.engageTime = Math.max(this.engageTime - deltaTime, 0);
    }
  }
}
