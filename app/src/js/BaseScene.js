import Compositor from '@/js/Compositor';
import EventEmitter from '@/js/EventEmitter';


export default class BaseScene {
  static EVENT_COMPLETE = Symbol('scene complete');
  constructor() {
    this.events = new EventEmitter();
    this.comp = new Compositor();
  }

  draw(gameContext) {
    this.comp.draw(gameContext.videoContext);
  }

  update(gameContext) {}

  pause() {
    
  }
}