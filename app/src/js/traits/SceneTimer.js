import { Trait } from '@/js/Entity';

export default class SceneTimer extends Trait {
  static EVENT_TIMER_OK = Symbol('timer ok');
  static EVENT_TIMER_IDLE = Symbol('timer idle');

  constructor() {
    super('sceneTimer');
    this.emitted = null;
  }

  update(entity, gameContext, scene) {
    if (this.emitted === false && scene.totalTime > 5) {
      scene.events.emit(SceneTimer.EVENT_TIMER_IDLE);
      this.emitted = true;
    }

    if (this.emitted === null && scene.totalTime > 0) {
      scene.events.emit(SceneTimer.EVENT_TIMER_OK);
      this.emitted = false;
    }
  }
}