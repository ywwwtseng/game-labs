import { Vec2 } from '@/js/math';
import { Sides } from '@/js/constants';
import BoundingBox from '@/js/BoundingBox';

export class Trait {
  constructor(name) {
    this.NAME = name;

    this.tasks = [];
  }

  finalize() {
    this.tasks.forEach((task) => task());
    this.tasks.length = 0;
  }

  queue(task) {
    this.tasks.push(task);
  }

  collides(us, them) {}

  obstruct() {}

  update() {}
}

export default class Entity {
  constructor() {
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
    this.traits.forEach((trait) => {
      trait.finalize();
    });
  }

  update(deltaTime, world) {
    this.traits.forEach((trait) => {
      trait.update(this, deltaTime, world);
    });

    this.lifetime += deltaTime;
  }
}