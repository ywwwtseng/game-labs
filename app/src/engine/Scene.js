import Compositor from '@/engine/Compositor';
import EventEmitter from '@/engine/EventEmitter';

export default class Scene {
  static EVENT_LOADED = Symbol('scene loaded');

  constructor() {
    this._loaded = false;
    this.name = '';
    this.active = false;
    this.events = new EventEmitter();
    this.comp = new Compositor();
  }

  get loaded() {
    return this._loaded;
  }

  set loaded(value) {
    this._loaded = value;
    this.events.emit(Scene.EVENT_LOADED);
  }

  draw(gameContext) {
    this.comp.draw(gameContext.videoContext);
  }

  update(gameContext) {}

  pause() {}
}
