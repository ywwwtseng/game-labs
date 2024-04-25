import Entity from '@/js/Entity';
import Go from '@/js/traits/Go';
import Jump from '@/js/traits/Jump';
import { loadSpriteSheet } from '@/js/loaders';
import { createAnimByDirection } from '@/js/anim';
import { DIRECTION } from '@/js/constants';

export function createRole() {
  return loadSpriteSheet('role')
    .then((sprite) => {
      const role = new Entity();

      role.addTrait(new Go());
      role.addTrait(new Jump());

      const runRunAnim = createAnimByDirection(
        [
          'idle',
          'run-2',
          'run-3',
          'run-4',
          'run-5',
        ],
        10
      );

      function routeFrame(role) {
        if (role.vel.x > 0) {
          return runRunAnim[DIRECTION.RIGHT](role.go.distance.x);
        }

        if (role.vel.x < 0) {
          return runRunAnim[DIRECTION.LEFT](role.go.distance.x);
        }

        if (role.vel.y > 0) {
          return runRunAnim[DIRECTION.DOWN](role.go.distance.y);
        }

        if (role.vel.y < 0) {
          return runRunAnim[DIRECTION.UP](role.go.distance.y);
        }

        return `idle${role.go.heading}`;
      }
      
      role.draw = function drawRole(context) {
        sprite.draw(routeFrame(this), context, 0, 0);
      };

      return role;
    });
}