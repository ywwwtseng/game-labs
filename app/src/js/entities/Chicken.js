import Entity, { Trait } from '@/js/Entity';
import Physics from '@/js/traits/Physics';
import Solid from '@/js/traits/Solid';
import PendulumMove from '@/js/traits/PendulumMove';
import Killable from '@/js/traits/Killable';
import Attack from '@/js/traits/Attack';
import { loadSpriteSheet } from '@/js/loaders/sprite';
import { DIRECTION } from '@/js/constants';

export function loadChicken() {
  return loadSpriteSheet('chicken')
    .then(createChickenFactory);
}

class Behavior extends Trait {
  constructor() {
    super('behavior');

    this.listen(Attack.EVENT_ATTACK, (us, them) => {
      if (us.killable.dead) {
        return;
      }

      us.pendulumMove.enable = false;
      us.killable.kill();
    });
  }

  collides(us, them) {
    // if (us.killable.dead) {
    //   return;
    // }

    // if (them.attack.engageTime) {
    //   us.pendulumMove.enable = false;
    //   us.killable.kill();
    //   // them.killable.kill();
    // }
  }
}

export function createChickenFactory(sprite) {
  const walkAnim = sprite.animations.get('walk');

  function routeFrame(chicken) {
    if (chicken.pendulumMove.speed > 0) {
      return walkAnim[DIRECTION.RIGHT](chicken.pendulumMove.lifetime);
    }

    return walkAnim[DIRECTION.LEFT](chicken.pendulumMove.lifetime);
  }

  function drawChicken(context) {
    sprite.draw(routeFrame(this), context, 0, 0);
  }

  return function createChicken() {
    const chicken = new Entity();
    chicken.size.set(8, 8);
    chicken.offset.set(4, 6);

    chicken.addTrait(new Physics());
    chicken.addTrait(new Solid());
    chicken.addTrait(new PendulumMove());
    chicken.addTrait(new Behavior());
    chicken.addTrait(new Killable());
    
    chicken.draw = drawChicken;

    return chicken;
  }
}