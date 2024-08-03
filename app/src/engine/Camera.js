import Dimensions from '@/engine/Dimensions';
import { Vec2 } from '@/engine/math';

export default class Camera {
  constructor() {
    this.pos = new Vec2(0, 0);
    this.size = new Vec2(
      Dimensions.get('canvas').width,
      Dimensions.get('canvas').height,
    );

    window.addEventListener('resize', (event) => {
      this.size.set(
        Dimensions.get('canvas').width,
        Dimensions.get('canvas').height,
      );
    });
  }
}
