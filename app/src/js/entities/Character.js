import Entity from '@/js/Entity';
import Physics from '@/js/traits/Physics';
import Solid from '@/js/traits/Solid';
import Go from '@/js/traits/Go';
import Attack from '@/js/traits/Attack';
import Killable from '@/js/traits/Killable';
import { loadSpriteSheet } from '@/js/loaders';
import { DIRECTION } from '@/js/constants';

export function loadCharacter() {
  return loadSpriteSheet('character')
    .then(createCharacterFactory);
}

export function createCharacterFactory(sprite) {
  const runAnim = sprite.animations.get('run');
  const attackAnim = sprite.animations.get('attack');

  function routeFrame(character) {
    if (character.attack.lifetime) {
      return attackAnim[character.go.heading](character.attack.lifetime);
    }
    
    if (character.vel.x > 0) {
      return runAnim[DIRECTION.RIGHT](character.go.distance.x);
    }

    if (character.vel.x < 0) {
      return runAnim[DIRECTION.LEFT](character.go.distance.x);
    }

    if (character.vel.y > 0) {
      return runAnim[DIRECTION.DOWN](character.go.distance.y);
    }

    if (character.vel.y < 0) {
      return runAnim[DIRECTION.UP](character.go.distance.y);
    }

    return `idle${character.go.heading}`;
  }

  function drawCharacter(context) {
    sprite.draw(routeFrame(this), context, 0, 0);
  }

  return function createCharacter() {
    const character = new Entity();
    character.size.set(14, 14);
    character.offset.set(1, 1);
    character.addTrait(new Physics());
    character.addTrait(new Solid());
    character.addTrait(new Go());
    character.addTrait(new Attack());
    character.addTrait(new Killable());
    
    character.killable.removeAfter = 0;
    
    character.draw = drawCharacter;
    return character;
  }
}