
import TileResolver from '@/js/TileResolver';
import { obstructs } from '@/js/tiles/obstructs';
import { flower } from '@/js/tiles/flower';
import { grass } from '@/js/tiles/grass';

const handlers = {
  flower,
  grass,
  obstructs,
};

export default class TileCollider {
  constructor() {
    this.resolvers = [];
  }

  addGrid(tileMatrix) {
    this.resolvers.push(new TileResolver(tileMatrix));
  }

  checkX(entity, gameContext, world) {
    let x;
    if (entity.vel.x > 0) {
      x = entity.bounds.right;
    } else if (entity.vel.x < 0) {
      x = entity.bounds.left;
    } else {
      return;
    }

    for (const resolver of this.resolvers) { 
      const matches = resolver.searchByRange(
        x, x,
        entity.bounds.top, entity.bounds.bottom,
      );
      
      matches.forEach((match) => {
        this.handler(0, entity, match, resolver, gameContext, world);
      });
    }
  }

  checkY(entity, gameContext, world) {
    let y;
    if (entity.vel.y > 0) {
      y = entity.bounds.bottom;
    } else if (entity.vel.y < 0) {
      y = entity.bounds.top;
    } else {
      return;
    }

    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        entity.bounds.left, entity.bounds.right,
        y, y,
      );
      
      matches.forEach((match) => {
        this.handler(1, entity, match, resolver, gameContext, world);
      });
    }
  }

  handler(index, entity, match, resolver, gameContext, world) {
    const tileCollisionContext = {
      entity,
      match,
      resolver,
      gameContext,
      world,
    };

    const handler = handlers[match.tile.type];
    if (handler) {
      handler[index](tileCollisionContext);
    }
  }

  test(entity) {
    this.checkY(entity);
  }
}