import { loadPlayer } from '@/js/entities/Player';
import { loadChicken } from '@/js/entities/Chicken';

export function loadEntities(audioContext) {
  const entityFactories = {};

  function addAs(name) {
    return (factory) => entityFactories[name] = factory;
  }

  return Promise.all([
    loadPlayer(audioContext).then(addAs('player')),
    loadChicken(audioContext).then(addAs('chicken')),
  ])
  .then(() => entityFactories);
}