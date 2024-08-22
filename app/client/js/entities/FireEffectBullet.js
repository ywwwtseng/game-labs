import Entity from '@/engine/Entity';
import Trait from '@/engine/Trait';
import { loadObject2D } from '@/engine/loaders/object2d';

import Velocity from '@/js/traits/Velocity';
import Killable from '@/js/traits/Killable';
import SkillController from '@/js/traits/SkillController';

export function loadFireEffectBullet() {
  return loadObject2D('fire-effect-bullet').then(
    createFireEffectBulletFactory,
  );
}

class Behavior extends Trait {
  collides(us, them) {
    them.events.emit(SkillController.EVENT_SKILL, them, us);
    if (us.traits.has(Killable)) {
      us.traits.get(Killable).kill();
      us.vel.set(0, 0);
    }
  }

  update(entity) {
    if (entity.traits.has(Killable)) {
      if (entity.lifetime > 0.6 && !entity.traits.get(Killable).dead) {
        entity.traits.get(Killable).kill();
        entity.vel.set(0, 0);
      }
    }
  }
}

export function createFireEffectBulletFactory(sprite) {
  const fireballAnim = sprite.animations.get('fireball');
  const fireballDieAnim = sprite.animations.get('fireball-die');

  function routeFrame(bullet) {
    if (bullet.traits.get(Killable).dead) {
      return fireballDieAnim(bullet.lifetime);
    }

    return fireballAnim(bullet.lifetime);
  }

  function drawFireEffectBullet(context) {
    sprite.draw(routeFrame(this), context, 0, 0);
  }

  return function createFireEffectBullet(dir) {
    const bullet = new Entity();
    bullet.size.set(16, 16);

    bullet.addTrait(new Velocity());
    bullet.addTrait(new Behavior());
    bullet.addTrait(new Killable());

    bullet.draw = drawFireEffectBullet;

    return bullet;
  };
}
