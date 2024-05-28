import Entity from '@/js/Entity';
import Physics from '@/js/traits/Physics';
import Solid from '@/js/traits/Solid';
import Go from '@/js/traits/Go';
import Attack from '@/js/traits/Attack';
import Killable from '@/js/traits/Killable';
import SkillController from '@/js/traits/SkillController';
import { loadSpriteSheet } from '@/js/loaders/sprite';
import { DIRECTION } from '@/js/constants';
import { loadAudioBoard } from '@/js/loaders/audio';

export function loadRole(audioContext) {
  return Promise.all([
    loadSpriteSheet('role'),
    loadAudioBoard('role', audioContext),
  ])
  .then(([sprite, audio]) => {
    return createRoleFactory(sprite, audio);
  });
}

export function createRoleFactory(sprite, audio) {
  const runAnim = sprite.animations.get('run');
  const attackAnim = sprite.animations.get('attack');

  function emitBullet(role, gameContext, scene) {
    const bullet = gameContext.entityFactory.bullet();

    if (role.traits.get(Go).heading === DIRECTION.DOWN) {
      bullet.vel.set(0, 200);
      bullet.pos.copy(role.pos).add({x: 0, y: 16});
    } else if (role.traits.get(Go).heading === DIRECTION.UP) {
      bullet.vel.set(0, -200);
      bullet.pos.copy(role.pos).add({x: 0, y: -16});
    } else if (role.traits.get(Go).heading === DIRECTION.LEFT) {
      bullet.vel.set(-200, 0);
      bullet.pos.copy(role.pos).add({x: -16, y: 0});
    } else {
      bullet.vel.set(200, 0);
      bullet.pos.copy(role.pos).add({x: 16, y: 0});
    }

    scene.entities.unshift(bullet);
  }

  function routeFrame(role) {
    if (role.traits.get(Attack).lifetime) {
      return attackAnim[role.traits.get(Go).heading](role.traits.get(Attack).lifetime);
    }

    if (role.vel.x === 0 && role.vel.y === 0) {
      return `idle${role.traits.get(Go).heading}`;
    }

    return runAnim[role.traits.get(Go).heading](role.traits.get(Go).distance.length());
  }

  function drawRole(context) {
    sprite.draw(routeFrame(this), context, 0, 0);
  }

  return function createRole() {
    const role = new Entity();
    role.audio = audio;
    role.size.set(14, 14);
    role.offset.set(1, 1);
    role.addTrait(new Physics());
    role.addTrait(new Solid());
    role.addTrait(new Go());
    role.addTrait(new Attack());
    role.addTrait(new Killable());
    role.traits.get(Killable).removeAfter = 0;
    role.addTrait(new SkillController(emitBullet));
    role.traits.get(SkillController).setSkill('bullet', emitBullet);
    
    
    role.draw = drawRole;
    return role;
  }
}