import Trait from '@/engine/Trait';

export default class IntervalEmitter extends Trait {
  constructor() {
    super();
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
