import Entity from '@/js/Entity';
import Go from '@/js/traits/Go';
import { loadSpriteSheet } from '@/js/loaders';
import { DIRECTION } from '@/js/constants';

export function loadCharacter() {
  return loadSpriteSheet('character')
    .then(createCharacterFactory);
}

export function createCharacterFactory(sprite) {
  const runAnim = sprite.animations.get('run');

  function routeFrame(character) {
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
    character.addTrait(new Go());
    character.draw = drawCharacter;
    return character;
  }
}