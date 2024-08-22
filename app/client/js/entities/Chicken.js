import Entity from '@/engine/Entity';
import Trait from '@/engine/Trait';
import { loadObject2D } from '@/engine/loaders/object2d';
import { DIRECTION } from '@/engine/constants';

import Physics from '@/js/traits/Physics';
import Solid from '@/js/traits/Solid';
import PendulumMove from '@/js/traits/PendulumMove';
import Killable from '@/js/traits/Killable';
import Attack from '@/js/traits/Attack';
import SkillController from '@/js/traits/SkillController';

export function loadChicken() {
  return loadObject2D('chicken').then(createChickenFactory);
}

class Behavior extends Trait {
  constructor() {
    super();

    this.listen(Attack.EVENT_ATTACK, (us, them) => {
      if (!us.traits.has(Killable) || us.traits.get(Killable).dead) {
        return;
      }

      us.traits.get(Killable).kill();

      if (us.traits.has(PendulumMove)) {
        us.traits.get(PendulumMove).enable = false;
      }
    });

    this.listen(SkillController.EVENT_SKILL, (us, them) => {
      if (!us.traits.has(Killable) || us.traits.get(Killable).dead) {
        return;
      }

      us.traits.get(Killable).kill();

      if (us.traits.has(PendulumMove)) {
        us.traits.get(PendulumMove).enable = false;
      }
    });
  }

  collides(us, them) {
    // if (us.traits.get(Killable).dead) {
    //   return;
    // }
    // if (them.traits.get(Attack).engageTime) {
    //   us.traits.get(PendulumMove).enable = false;
    //   us.traits.get(Killable).kill();
    //   // them.traits.get(Killable).kill();
    // }
  }
}

export function createChickenFactory(sprite) {
  const walkAnim = sprite.animations.get('walk');

  function routeFrame(chicken) {
    if (chicken.traits.get(PendulumMove).speed > 0) {
      return walkAnim[DIRECTION.RIGHT](
        chicken.traits.get(PendulumMove).lifetime,
      );
    }

    return walkAnim[DIRECTION.LEFT](chicken.traits.get(PendulumMove).lifetime);
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
  };
}
