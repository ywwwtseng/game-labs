import { loadRole } from '@/js/entities/Role';
import { loadChicken } from '@/js/entities/Chicken';
import { loadTree } from '@/js/entities/Tree';
import { loadFireEffectBullet } from '@/js/entities/FireEffectBullet';

export function loadEntities(audioContext) {
  const entityFactories = {};

  function addAs(name) {
    return (factory) => entityFactories[name] = factory;
  }

  return Promise.all([
    loadRole(audioContext, entityFactories).then(addAs('role')),
    loadChicken(audioContext).then(addAs('chicken')),
    loadTree(audioContext).then(addAs('tree')),
    loadFireEffectBullet(audioContext).then(addAs('bullet')),
  ])
  .then(() => entityFactories);
}