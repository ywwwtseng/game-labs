import { findPlayers } from '@/js/helpers/player';
import Player from '@/js/traits/Player';

function getPlayer(entities) {
  for (const entity of findPlayers(entities)) {
    return entity;
  }
}

export function createPlayerProgressLayer(font, scene) {
  const size = font.size;
  

  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = 32;
  spriteBuffer.height = 32;
  const spriteBufferContext = spriteBuffer.getContext('2d');

  return function drawPlayerProgress(context) {
    const entity = getPlayer(scene.entities);
    const playerTrait = entity.traits.get(Player);
    font.print('Scene ' + scene.name, context, size * 12, size * 12);

    spriteBufferContext.clearRect(0, 0, spriteBuffer.width, spriteBuffer.height);
    entity.draw(spriteBufferContext);
    context.drawImage(spriteBuffer, size * 12, size * 15);

    font.print(playerTrait.name, context, size * 15, size * 15.2);
  }
}