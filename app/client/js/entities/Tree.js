import Entity from '@/engine/Entity';
import Trait from '@/engine/Trait';
import { loadObject2D } from '@/engine/loaders/object2d';
import { DIRECTION } from '@/engine/constants';

import Physics from '@/js/traits/Physics';
import Solid from '@/js/traits/Solid';

export function loadTree() {
  return loadObject2D('game-tiles').then(createTreeFactory);
}

class Behavior extends Trait {}

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
  };
}
