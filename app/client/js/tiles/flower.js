import { SIDES } from '@/engine/constants';

import Player from '@/js/traits/Player';

function handlerX({ entity, match }) {
  if (entity.vel.x > 0) {
    if (entity.bounds.right > match.x1) {
      entity.obstruct(SIDES.RIGHT, match);
    }
  } else if (entity.vel.x < 0) {
    if (entity.bounds.left < match.x2) {
      entity.obstruct(SIDES.LEFT, match);
    }
  }
}

function handlerY({ entity, match, resolver, gameContext, scene }) {
  if (entity.vel.y > 0) {
    if (entity.bounds.bottom > match.y1) {
      entity.obstruct(SIDES.BOTTOM, match);
    }
  } else if (entity.vel.y < 0) {
    if (entity.traits.get(Player)) {
      const grid = resolver.matrix;
      grid.delete(match.indexX, match.indexY);
      const chicken = gameContext.entityFactory.chicken();
      chicken.pos.set(entity.pos.x, match.y1);
      scene.entities.push(chicken);
    }

    if (entity.bounds.top < match.y2) {
      entity.obstruct(SIDES.TOP, match);
    }
  }
}

export const flower = [handlerX, handlerY];
