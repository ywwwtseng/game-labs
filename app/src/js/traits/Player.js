import { Trait } from '@/js/Entity';
import Attack from '@/js/traits/Attack';

export default class Player extends Trait {
  constructor() {
    super('player');
    this.name = 'UNNAMED';
    this.coins = 0;

    this.listen(Attack.EVENT_ATTACK, () => {
      this.coins++;
    });
  }
}