import Entity from '@/js/Entity';
import Physics from '@/js/traits/Physics';
import Solid from '@/js/traits/Solid';
import Go from '@/js/traits/Go';
import Attack from '@/js/traits/Attack';
import Killable from '@/js/traits/Killable';
import { loadSpriteSheet } from '@/js/loaders';
import { DIRECTION } from '@/js/constants';
import { loadAudioBoard } from '@/js/loaders/audio';

export function loadPlayer(audioContext) {
  return Promise.all([
    loadSpriteSheet('player'),
    loadAudioBoard('player', audioContext),
  ])
  .then(([sprite, audio]) => {
    return createPlayerFactory(sprite, audio);
  });
}

export function createPlayerFactory(sprite, audio) {
  const runAnim = sprite.animations.get('run');
  const attackAnim = sprite.animations.get('attack');

  function routeFrame(player) {
    if (player.attack.lifetime) {
      return attackAnim[player.go.heading](player.attack.lifetime);
    }
    
    if (player.vel.x > 0) {
      return runAnim[DIRECTION.RIGHT](player.go.distance.x);
    }

    if (player.vel.x < 0) {
      return runAnim[DIRECTION.LEFT](player.go.distance.x);
    }

    if (player.vel.y > 0) {
      return runAnim[DIRECTION.DOWN](player.go.distance.y);
    }

    if (player.vel.y < 0) {
      return runAnim[DIRECTION.UP](player.go.distance.y);
    }

    return `idle${player.go.heading}`;
  }

  function drawPlayer(context) {
    sprite.draw(routeFrame(this), context, 0, 0);
  }

  return function createPlayer() {
    const player = new Entity();
    player.audio = audio;
    player.size.set(14, 14);
    player.offset.set(1, 1);
    player.addTrait(new Physics());
    player.addTrait(new Solid());
    player.addTrait(new Go());
    player.addTrait(new Attack());
    player.addTrait(new Killable());
    
    player.killable.removeAfter = 0;
    
    player.draw = drawPlayer;
    return player;
  }
}