import { findPlayers } from '@/js/player';

function getPlayerTrait(world) {
  for (const entity of findPlayers(world)) {
    return entity.player;
  }
}

// function getTimerTrait(world) {
//   for (const entity of world.entities) {
//     if (entity.worldTimer) {
//       return entity.worldTimer;
//     }
//   }
// }

export function createDashboardLayer(font, world) {
  const LINE1 = font.size;
  const LINE2 = font.size * 2;

  const score = 24500;

  return function drawDashboard(context) {
    const playerTrait = getPlayerTrait(world);
    // const timerTrait = getTimerTrait(world);

    font.print(playerTrait.name, context, 16, LINE1);
    font.print(score.toString().padStart(6, '0'), context, 16, LINE2);

    font.print('.x' + playerTrait.diamond.toString().padStart(2, '0'), context, 88, LINE1);
    font.print('@x' + playerTrait.coins.toString().padStart(2, '0'), context, 88, LINE2);

    font.print('WORLD', context, 144, LINE1);
    font.print('1-1', context, 152, LINE2);

    font.print('TIME', context, 200, LINE1);
    font.print(new Number(world.totalTime).toFixed().toString().padStart(3, '0'), context, 208, LINE2);
  }
}