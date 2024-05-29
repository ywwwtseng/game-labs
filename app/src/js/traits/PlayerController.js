import Trait from '@/engine/Trait';
import { Vec2 } from '@/engine/math';
import { DIRECTION } from '@/engine/constants';

import Attack from '@/js/traits/Attack';
import Go from '@/js/traits/Go';
import Killable from '@/js/traits/Killable';


export default class PlayerController extends Trait {
  constructor() {
    super();
    this.checkpoint = new Vec2(0, 0);
    this.player = null;
  }

  setPlayer(entity) {
    this.player = entity;
  }

  update(entity, { deltaTime }, scene) {
    if (!scene.entities.find(entity => entity === this.player)) {
      this.player.traits.get(Killable).revive();
      this.player.traits.get(Attack).stop();
      this.player.vel.set(0, 0);
      this.player.traits.get(Go).heading = DIRECTION.DOWN;
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
      scene.entities.unshift(this.player);
    }
  }
}