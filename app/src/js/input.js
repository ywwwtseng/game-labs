import Keyboard from '@/engine/KeyboardState';
import Joystick from '@/engine/Joystick';
import InputRouter from '@/engine/InputRouter';
import Attack from '@/js/traits/Attack';
import Go from '@/js/traits/Go';
import SkillController from '@/js/traits/SkillController';
import { DIRECTION } from '@/engine/constants';

export function setupKeyboard(window) {
  const input = new Keyboard();
  const router = new InputRouter();

  input.listenTo(window);

  input.addMapping('ArrowUp', (keyState) => {
    router.route((entity) => entity.traits.get(Go).dir.y += keyState ? -1 : 1);
  });

  input.addMapping('ArrowDown', (keyState) => {
    router.route((entity) => entity.traits.get(Go).dir.y += keyState ? 1 : -1);
  });

  input.addMapping('ArrowLeft', (keyState) => {
    router.route((entity) => entity.traits.get(Go).dir.x += keyState ? -1 : 1);
  });

  input.addMapping('ArrowRight', (keyState) => {
    router.route((entity) => entity.traits.get(Go).dir.x += keyState ? 1 : -1);
  });

  input.addMapping('Space', (keyState) => {
    if (keyState) {
      router.route((entity) => entity.traits.get(Attack).start());
    }
  });

  return router;
}

export function setupJoystick(entity) {
  const input = new Joystick();
  const router = new InputRouter();

  input.onMove = ({x, y}) => {
    router.route((entity) => {
      entity.traits.get(Go).dir.x = x;
      entity.traits.get(Go).dir.y = y;
    });
  };

  input.onPress = () => {
    router.route((entity) => entity.traits.get(Attack).start());
  };

  input.onLongPress = () => {
    router.route((entity) => entity.traits.get(SkillController).doSkill('bullet'));
  };

  return router;
}