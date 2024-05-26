import { Trait } from '@/js/Entity';

export default class SkillController extends Trait {
  static EVENT_SKILL = Symbol('skill');

  constructor(emitter) {
    super('skillController');

    this.emitter = emitter;
    this.emitters = [];
  }

  setSkill(name, emitter) {
    this[name] = emitter;
  }

  doSkill(name) {
    this.emitters.push(this[name]);
  }

  process(entity, gameContext, world) {
    for (const emitter of this.emitters) {
      emitter(entity, gameContext, world);
    }
  }

  update(entity, gameContext, world) {
    if (this.emitters.length > 0) {
      this.process(entity, gameContext, world);
      this.emitters.length = 0;
    }
  }
} 