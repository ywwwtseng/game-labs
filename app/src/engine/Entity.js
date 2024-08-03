import AudioBoard from '@/engine/AudioBoard';
import Trait from '@/engine/Trait';
import { Vec2 } from '@/engine/math';
import BoundingBox from '@/engine/BoundingBox';
import EventBuffer from '@/engine/EventBuffer';

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

    this.traits = new Map();
  }

  addTrait(trait) {
    this.traits.set(trait.constructor, trait);
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
    this.events.emit(Trait.EVENT_TASK, this);

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

  update(gameContext, scene) {
    this.traits.forEach((trait) => {
      trait.update(this, gameContext, scene);
    });

    this.playSounds(this.audio, gameContext.audioContext);

    this.lifetime += gameContext.deltaTime;
  }
}
