import { loadCharacter } from '@/js/entities/Character';
import { loadChicken } from '@/js/entities/Chicken';

export function loadEntities() {
  const entityFactories = {};

  function addAs(name) {
    return (factory) => entityFactories[name] = factory;
  }

  return Promise.all([
    loadCharacter().then(addAs('character')),
    loadChicken().then(addAs('chicken')),
  ])
  .then(() => entityFactories);
}