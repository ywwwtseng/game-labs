import { findPlayers } from '@/js/helpers/player';
import Player from '@/js/traits/Player';
// import SceneTimer from '@/js/traits/SceneTimer';

function getPlayerTrait(entities) {
  for (const entity of findPlayers(entities)) {
    return entity.traits.get(Player);
  }
}

// function getTimerTrait(scene) {
//   for (const entity of scene.entities) {
//     if (entity.traits.has(SceneTimer)) {
//       return entity.traits.get(SceneTimer);
//     }
//   }
// }

export function createDashboardLayer(font, scene) {
  const LINE1 = font.size;
  const LINE2 = font.size * 2;

  const score = 24500;

  return function drawDashboard(context) {
    const playerTrait = getPlayerTrait(scene.entities);
    // const timerTrait = getTimerTrait(scene);

    font.print(playerTrait.name, context, 16, LINE1);
    font.print(score.toString().padStart(6, '0'), context, 16, LINE2);

    font.print(
      '.x' + playerTrait.diamond.toString().padStart(2, '0'),
      context,
      88,
      LINE1,
    );
    font.print(
      '@x' + playerTrait.coins.toString().padStart(2, '0'),
      context,
      88,
      LINE2,
    );

    font.print('WORLD', context, 144, LINE1);
    font.print(scene.name, context, 144, LINE2);

    font.print('SERVER TIME', context, 200, LINE1);
    font.print(
      new Number(scene.gameContext.timestamp)
        .toFixed()
        .toString()
        .padStart(3, '0'),
      context,
      200,
      LINE2,
    );
  };
}
