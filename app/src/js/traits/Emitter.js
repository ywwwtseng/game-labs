import { Trait } from '@/js/Entity';

export default class Emitter extends Trait {
  constructor() {
    super('emitter');
    this.interval = 2;
    this.coolDown = this.interval;
    this.emitters = [];
  }

  emit(entity, world) {
    for (const emitter of this.emitters) {
      emitter(entity, world);
    }
  }

  update(entity, { deltaTime }, world) {
    this.coolDown -= deltaTime;
    if (this.coolDown <= 0) {
      this.emit(entity, world);
      this.coolDown = this.interval;
    }
  }
} 