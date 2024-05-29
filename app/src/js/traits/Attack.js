import Trait from '@/engine/Trait';
import { FRAME_DURATION } from '@/engine/constants';

import Player from '@/js/traits/Player';

export default class Attack extends Trait {
  static EVENT_ATTACK = Symbol('attack');

  constructor() {
    super();
    this.ready = false;
    this.lifetime = 0;
    this.duration = 20 * FRAME_DURATION;
  }

  start() {
    if (this.ready === false) {
      this.ready = true;
    }
  }

  stop() {
    this.ready = false;
    this.lifetime = 0;
  }

  collides(us, them) {
    if (this.lifetime === this.duration / 2) {
      us.traits.get(Player).addCoins(1);
      them.events.emit(Attack.EVENT_ATTACK, them, us);
    }
  }

  update(entity, { deltaTime }, scene) {
    if (this.ready) {
      if (this.lifetime === 0) {
        entity.sounds.add('attack');
      }

      this.lifetime += deltaTime;

      if (this.lifetime >= this.duration) {
        this.stop();
      }
    }
  }
}
