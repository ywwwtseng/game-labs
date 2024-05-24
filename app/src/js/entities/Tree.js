import Entity, { Trait } from '@/js/Entity';
import Physics from '@/js/traits/Physics';
import Solid from '@/js/traits/Solid';
import { loadSpriteSheet } from '@/js/loaders';
import { DIRECTION } from '@/js/constants';

export function loadTree() {
  return loadSpriteSheet('game-tiles')
    .then(createTreeFactory);
}

class Behavior extends Trait {
  constructor() {
    super('behavior');
  }

  collides(us, them) {
    // if (us.killable.dead) {
    //   return;
    // }

    // if (them.attack.engageTime) {
    //   us.pendulumMove.enable = false;
    //   us.killable.kill();
    //   // them.killable.kill();
    // }
  }
}

export function createTreeFactory(sprite) {
  function routeFrame(tree) {
    return 'default';
  }

  function drawTree(context) {
    sprite.draw(routeFrame(this), context, 0, 0);
  }

  return function createTree() {
    const tree = new Entity();
    tree.size.set(16, 8);
    tree.offset.set(24, 56);

    tree.addTrait(new Physics());
    tree.addTrait(new Solid());
    tree.addTrait(new Behavior());
    
    tree.draw = drawTree;

    return tree;
  }
}