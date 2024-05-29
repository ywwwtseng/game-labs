import Trait from '@/engine/Trait';

export default class SkillController extends Trait {
  static EVENT_SKILL = Symbol('skill');

  constructor(emitter) {
    super();
    this.emitter = emitter;
    this.emitters = [];
  }

  setSkill(name, emitter) {
    this[name] = emitter;
  }

  doSkill(name) {
    this.emitters.push(this[name]);
  }

  process(entity, gameContext, scene) {
    for (const emitter of this.emitters) {
      emitter(entity, gameContext, scene);
    }
  }

  update(entity, gameContext, scene) {
    if (this.emitters.length > 0) {
      this.process(entity, gameContext, scene);
      this.emitters.length = 0;
    }
  }
} 