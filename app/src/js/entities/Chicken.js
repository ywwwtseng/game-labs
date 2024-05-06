import Entity from '@/js/Entity';
import Go from '@/js/traits/Go';
import PendulumWalk from '@/js/traits/PendulumWalk';
import { loadSpriteSheet } from '@/js/loaders';
import { DIRECTION } from '@/js/constants';

export function loadChicken() {
  return loadSpriteSheet('chicken')
    .then(createChickenFactory);
}

export function createChickenFactory(sprite) {
  const walkAnim = sprite.animations.get('walk');

  function routeFrame(chicken) {
    if (chicken.vel.x > 0) {
      return walkAnim[DIRECTION.RIGHT](chicken.lifetime);
    }

    if (chicken.vel.x < 0) {
      return walkAnim[DIRECTION.LEFT](chicken.lifetime);
    }

    if (chicken.vel.y > 0) {
      return walkAnim[DIRECTION.DOWN](chicken.lifetime);
    }

    if (chicken.vel.y < 0) {
      return walkAnim[DIRECTION.UP](chicken.lifetime);
    }

    return walkAnim[DIRECTION.RIGHT](chicken.lifetime);
  }

  function drawChicken(context) {
    sprite.draw(routeFrame(this), context, 0, 0);
  }

  return function createChicken() {
    const chicken = new Entity();
    chicken.size.set(16, 16);

    chicken.addTrait(new PendulumWalk());
    
    chicken.draw = drawChicken;

    return chicken;
  }
}