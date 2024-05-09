import { Vec2 } from '@/js/math';
import { Sides } from '@/js/constants';
import BoundingBox from '@/js/BoundingBox';

export class Trait {
  constructor(name) {
    this.NAME = name;
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

  obstruct(side) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side);
    });
  }

  update(deltaTime) {
    this.traits.forEach((trait) => {
      trait.update(this, deltaTime);
    });

    this.lifetime += deltaTime;
  }
}