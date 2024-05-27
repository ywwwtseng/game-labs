import { Trait } from '@/js/Entity';

export default class IntervalEmitter extends Trait {
  constructor() {
    super('intervalEmitter');
    this.interval = 2;
    this.coolDown = this.interval;
    this.emitters = [];
  }

  emit(entity, gameContext, scene) {
    for (const emitter of this.emitters) {
      emitter(entity, gameContext, scene);
    }
  }

  update(entity, gameContext, scene) {
    const { deltaTime } = gameContext;

    this.coolDown -= deltaTime;
    if (this.coolDown <= 0) {
      this.emit(entity, gameContext, scene);
      this.coolDown = this.interval;
    }
  }
} 