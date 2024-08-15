import { MatrixUtil } from '@/utils/MatrixUtil';

class Object2DUtil {
  static isObject2D(object) {
    return object.id && object.id.includes('object2d');
  }
  static getRect(object) {
    return [0, 0, ...MatrixUtil.sizeIndex(Object2DUtil.tiles(object))];
  }

  static hasAnimation(object) {
    return Boolean(object.anim);
  }

  static tiles(object) {
    if (Object2DUtil.hasAnimation(object)) {
      return object.anim.frames[0];
    } else {
      return object.tiles;
    }
  }
}

export { Object2DUtil };
