import Keyboard from '@/js/KeyboardState';
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