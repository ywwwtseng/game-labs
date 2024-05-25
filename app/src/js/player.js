import Entity from '@/js/Entity';
import Player from '@/js/traits/Player';
import PlayerController from '@/js/traits/PlayerController';

export function createPlayerEnv(playerEntity) {
  const playerEnv = new Entity();
  const playerControl = new PlayerController();
  playerControl.checkpoint.set(151 * 16, 155 * 16);
  playerControl.setPlayer(playerEntity);
  playerEnv.addTrait(playerControl);
  return playerEnv;
}

export function createPlayer(entity) {
  entity.addTrait(new Player());
  return entity;
}

export function* findPlayers(world) {
  for (const entity of world.entities) {
    if (entity.player) {
      yield entity;
    }
  }
}