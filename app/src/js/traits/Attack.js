import { Trait } from '@/js/Entity';
import { FRAME_DURATION } from '@/js/constants';

export default class Attack extends Trait {
  constructor() {
    super('attack');
    
    this.ready = false;
    this.lifetime = 0;
    this.duration = 20 * FRAME_DURATION;

    this.events.listen('attack', (us, them) => {
      if (them.killable.dead) {
        return;
      }

      them.pendulumMove.enable = false;
      them.killable.kill();
    });
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
      this.events.emit('attack', us, them);
    }
  }

  update(entity, { deltaTime }, world) {
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
