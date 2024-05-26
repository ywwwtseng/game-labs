import { Trait } from '@/js/Entity';
import Attack from '@/js/traits/Attack';

const COIN_DIAMOND_THRESHOLD = 100;

export default class Player extends Trait {
  constructor() {
    super('player');
    this.name = 'UNNAMED';
    this.coins = 0;
    this.diamond = 0;
  }

  addCoins(count) {
    this.coins += count;
    this.queue((entity) => entity.sounds.add('footstep'));
    if (this.coins >= COIN_DIAMOND_THRESHOLD) {
      const diamondCount = Math.floor(this.coins / COIN_DIAMOND_THRESHOLD);
      this.addDiamond(diamondCount);
      this.coins = this.coins % COIN_DIAMOND_THRESHOLD;
    }
  }

  addDiamond(count) {
    this.diamond += count;
  }
}