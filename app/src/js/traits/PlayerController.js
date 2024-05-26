import { Trait } from '@/js/Entity';
import { Vec2 } from '@/js/math';
import { DIRECTION } from '@/js/constants';

export default class PlayerController extends Trait {
  constructor() {
    super('playerController');
    this.checkpoint = new Vec2(0, 0);
    this.player = null;
  }

  setPlayer(entity) {
    this.player = entity;
  }

  update(entity, { deltaTime }, world) {
    if (!world.entities.find(entity => entity === this.player)) {
      this.player.killable.revive();
      this.player.attack.stop();
      this.player.vel.set(0, 0);
      this.player.go.heading = DIRECTION.DOWN;
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
      world.entities.unshift(this.player);
    }
  }
}