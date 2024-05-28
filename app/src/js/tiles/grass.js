import Player from '@/js/traits/Player';

function handler({ entity, match, resolver }) {
  if (entity.traits.get(Player)) {
    entity.traits.get(Player).addCoins(1);
    const grid = resolver.matrix;
    grid.delete(match.indexX, match.indexY);
  }
}

export const grass = [handler, handler];