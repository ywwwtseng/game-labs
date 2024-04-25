import Keyboard from '@/js/KeyboardState';
import { DIRECTION } from '@/js/constants';

export function setupKeyboard(entity) {
  const input = new Keyboard();

  input.addMapping('ArrowUp', (keyState) => {
    if (keyState) {
      entity.go.dir = DIRECTION.UP;
    } else {
      entity.go.dir = DIRECTION.NONE;
    }
  });

  input.addMapping('ArrowDown', (keyState) => {
    if (keyState) {
      entity.go.dir = DIRECTION.DOWN;
    } else {
      entity.go.dir = DIRECTION.NONE;
    }
  });

  input.addMapping('ArrowLeft', (keyState) => {
    if (keyState) {
      entity.go.dir = DIRECTION.LEFT;
    } else {
      entity.go.dir = DIRECTION.NONE;
    }
  });

  input.addMapping('ArrowRight', (keyState) => {
    if (keyState) {
      entity.go.dir = DIRECTION.RIGHT;
    } else {
      entity.go.dir = DIRECTION.NONE;
    }
  });

  return input;
}