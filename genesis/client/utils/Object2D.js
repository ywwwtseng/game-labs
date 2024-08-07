import { MatrixUtil } from '@/utils/MatrixUtil';

class Object2D {
  static getRect(object) {
    return [0, 0, ...MatrixUtil.sizeIndex(Object2D.tiles(object))];
  }

  static hasAnimation(object) {
    return Boolean(object.frames);
  }

  static tiles(object) {
    if (Object2D.hasAnimation(object)) {
      return object.frames[0];
    } else {
      return object.tiles;
    }
  }
}

export { Object2D };
