export function createDashboardLayer(font, playerEnv) {
  const LINE1 = font.size;
  const LINE2 = font.size * 2;

  const score = 24500;
  const coins = playerEnv.playerController.coins;

  return function drawDashboard(context) {
    font.print('PROJECT WEB3RPG', context, 16, LINE1);
    font.print(score.toString().padStart(6, '0'), context, 16, LINE2);

    font.print('@x' + coins, context, 88, LINE2);

    font.print('WORLD', context, 144, LINE1);
    font.print('1-1', context, 152, LINE2);

    font.print('TIME', context, 200, LINE1);
    font.print(new Number(300).toFixed().toString().padStart(3, '0'), context, 208, LINE2);
  }
}