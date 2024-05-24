import Keyboard from '@/js/KeyboardState';
import Joystick from '@/js/Joystick';
import { DIRECTION } from '@/js/constants';

export function setupKeyboard(entity) {
  const input = new Keyboard();

  input.addMapping('ArrowUp', (keyState) => {
    entity.go.dir.y += keyState ? -1 : 1;
  });

  input.addMapping('ArrowDown', (keyState) => {
    entity.go.dir.y += keyState ? 1 : -1;
  });

  input.addMapping('ArrowLeft', (keyState) => {
    entity.go.dir.x += keyState ? -1 : 1;
  });

  input.addMapping('ArrowRight', (keyState) => {
    entity.go.dir.x += keyState ? 1 : -1;
  });

  input.addMapping('Space', (keyState) => {
    if (keyState) {
      entity.attack.start();
    }
  });

  return input;
}

export function setupJoystick(entity) {
  const input = new Joystick();

  input.onMove = ({x, y}) => {
    entity.go.dir.x = x;
    entity.go.dir.y = y;
  };

  input.onPress = () => {
    entity.attack.start();
  };

  input.onLongPress = () => {
    console.log('onLongPress')
  };

  return input;
}