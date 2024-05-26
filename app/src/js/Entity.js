import { Vec2 } from '@/js/math';
import BoundingBox from '@/js/BoundingBox';
import AudioBoard from '@/js/AudioBoard';
import EventBuffer from '@/js/EventBuffer';

export class Trait {
  static EVENT_TASK = Symbol('task');

  constructor(name) {
    this.NAME = name;
    this.tasks = [];
    this.listeners = [];
  }

  listen(name, callback, count = Infinity) {
    const listener = { name, callback, count };
    this.listeners.push(listener);
  }

  finalize(entity) {
    this.listeners = this.listeners.filter((listener) => {
      entity.events.process(listener.name, listener.callback);
      return --listener.count;
    });
  }

  queue(task) {
    this.listen(Trait.EVENT_TASK, task, 1);
  }

  collides(us, them) {}

  obstruct() {}

  update() {}
}

export default class Entity {
  constructor() {
    this.audioBoard = new AudioBoard();
    this.sounds = new Set();
    this.events = new EventBuffer();

    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);
    this.size = new Vec2(0, 0);
    this.offset = new Vec2(0, 0);
    this.bounds = new BoundingBox(this.pos, this.size, this.offset);
    this.lifetime = 0;

    this.traits = [];
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.NAME] = trait;
  }

  collides(candidate) {
    this.traits.forEach((trait) => {
      trait.collides(this, candidate);
    });
  }

  obstruct(side, match) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side, match);
    });
  }

  draw() {}

  finalize() {
    this.events.emit(Trait.EVENT_TASK);

    this.traits.forEach((trait) => {
      trait.finalize(this);
    });
    this.events.clear();
  }

  playSounds(audioBoard, audioContext) {
    this.sounds.forEach((name) => {
      audioBoard.playAudio(name, audioContext);
    });

    this.sounds.clear();
  }

  update(gameContext, world) {
    this.traits.forEach((trait) => {
      trait.update(this, gameContext, world);
    });

    this.playSounds(this.audio, gameContext.audioContext);

    this.lifetime += gameContext.deltaTime;
  }
}