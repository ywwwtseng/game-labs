import Entity, { Trait } from '@/js/Entity';
import Velocity from '@/js/traits/Velocity';
import Killable from '@/js/traits/Killable';
import { loadSpriteSheet } from '@/js/loaders/sprite';

export function loadFireEffectBullet() {
  return loadSpriteSheet('fire-effect-bullet')
    .then(createFireEffectBulletFactory);
}

class Behavior extends Trait {
  constructor() {
    super('behavior');
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

  update(entity) {
    if (entity.lifetime > 0.6 && !entity.killable.dead) {
      entity.killable.kill();
      entity.vel.set(0, 0);
    }
  }
}

export function createFireEffectBulletFactory(sprite) {
  const fireballAnim = sprite.animations.get('fireball');
  const fireballDieAnim = sprite.animations.get('fireball-die');

  function routeFrame(bullet) {
    if (bullet.killable.dead) {
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
  }
}