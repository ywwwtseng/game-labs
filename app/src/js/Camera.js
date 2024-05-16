import Dimensions from '@/js/Dimensions';
import { Vec2 } from '@/js/math';

export default class Camera {
  constructor() {
    this.pos = new Vec2(0, 0);
    this.size = new Vec2(Dimensions.get('screen').width, Dimensions.get('screen').height);

    window.addEventListener('resize', (event) => {
      this.size.set(Dimensions.get('screen').width, Dimensions.get('screen').height);
    });
  }
}
