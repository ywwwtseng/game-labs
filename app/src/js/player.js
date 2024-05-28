import Entity from '@/js/Entity';
import Player from '@/js/traits/Player';
import PlayerController from '@/js/traits/PlayerController';

export function createPlayerEnv(playerEntity) {
  const playerEnv = new Entity();
  const playerControl = new PlayerController();
  playerControl.checkpoint.set(151 * 16, 155 * 16);
  playerEntity.pos.copy(playerControl.checkpoint);
  playerControl.setPlayer(playerEntity);
  playerEnv.addTrait(playerControl);
  return playerEnv;
}

export function makePlayer(entity, name) {
  const player = new Player();
  player.name = name;
  entity.addTrait(player);
  return entity;
}

export function* findPlayers(entities) {
  for (const entity of entities) {
    if (entity.traits.has(Player)) {
      yield entity;
    }
  }
}