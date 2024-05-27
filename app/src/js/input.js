import Keyboard from '@/js/KeyboardState';
import Joystick from '@/js/Joystick';
import InputRouter from '@/js/InputRouter';
import { DIRECTION } from '@/js/constants';

export function setupKeyboard(window) {
  const input = new Keyboard();
  const router = new InputRouter();

  input.listenTo(window);

  input.addMapping('ArrowUp', (keyState) => {
    router.route((entity) => entity.go.dir.y += keyState ? -1 : 1);
  });

  input.addMapping('ArrowDown', (keyState) => {
    router.route((entity) => entity.go.dir.y += keyState ? 1 : -1);
  });

  input.addMapping('ArrowLeft', (keyState) => {
    router.route((entity) => entity.go.dir.x += keyState ? -1 : 1);
  });

  input.addMapping('ArrowRight', (keyState) => {
    router.route((entity) => entity.go.dir.x += keyState ? 1 : -1);
  });

  input.addMapping('Space', (keyState) => {
    if (keyState) {
      router.route((entity) => entity.attack.start());
    }
  });

  return router;
}

export function setupJoystick(entity) {
  const input = new Joystick();
  const router = new InputRouter();

  input.onMove = ({x, y}) => {
    router.route((entity) => {
      entity.go.dir.x = x;
      entity.go.dir.y = y;
    });
  };

  input.onPress = () => {
    router.route((entity) => entity.attack.start());
  };

  input.onLongPress = () => {
    router.route((entity) => entity.skillController.doSkill('bullet'));
  };

  return router;
}