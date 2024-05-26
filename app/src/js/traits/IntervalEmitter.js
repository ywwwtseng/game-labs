import { Trait } from '@/js/Entity';

export default class IntervalEmitter extends Trait {
  constructor() {
    super('intervalEmitter');
    this.interval = 2;
    this.coolDown = this.interval;
    this.emitters = [];
  }

  emit(entity, gameContext, world) {
    for (const emitter of this.emitters) {
      emitter(entity, gameContext, world);
    }
  }

  update(entity, gameContext, world) {
    const { deltaTime } = gameContext;

    this.coolDown -= deltaTime;
    if (this.coolDown <= 0) {
      this.emit(entity, gameContext, world);
      this.coolDown = this.interval;
    }
  }
} 