import { Trait } from '@/js/Entity';

export default class WorldTimer extends Trait {
  static EVENT_TIMER_OK = Symbol('timer ok');
  static EVENT_TIMER_IDLE = Symbol('timer idle');

  constructor() {
    super('worldTimer');
    this.emitted = null;
  }

  update(entity, gameContext, world) {
    if (this.emitted === false && world.totalTime > 5) {
      world.events.emit(WorldTimer.EVENT_TIMER_IDLE);
      this.emitted = true;
    }

    if (this.emitted === null && world.totalTime > 0) {
      world.events.emit(WorldTimer.EVENT_TIMER_OK);
      this.emitted = false;
    }
  }
}