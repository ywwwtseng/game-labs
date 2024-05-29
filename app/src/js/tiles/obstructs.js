import { SIDES } from '@/engine/constants';

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

function handlerY({ entity, match }) {
  if (entity.vel.y > 0) {
    if (entity.bounds.bottom > match.y1) {
      entity.obstruct(SIDES.BOTTOM, match);
    }
  } else if (entity.vel.y < 0) {
    if (entity.bounds.top < match.y2) {
      entity.obstruct(SIDES.TOP, match);
    }
  }
}

export const obstructs = [handlerX, handlerY];