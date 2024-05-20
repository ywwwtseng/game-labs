import { SIDES } from '@/js/constants';
import { Vec2 } from '@/js/math';

export default class BoundingBox {
  constructor(pos, size, offset) {
    this.pos = pos;
    this.size = size;
    this.offset = offset;
  }

  overlaps(box) {
    // .--------------------.
    // | this               |
    // |             .------|--------------.
    // |             | box  |              |
    // |             |      |              |
    // |             |      |              |
    // '--------------------'              |
    //               |                     |
    //               .---------------------.

    return this.bottom > box.top
      && this.top < box.bottom
      && this.left < box.right
      && this.right > box.left;
  }

  get bottom() {
    return this.pos.y + this.size.y + this.offset.y;
  }

  set bottom(y) {
    this.pos.y = y - (this.size.y + this.offset.y);
  }

  get top() {
    return this.pos.y + this.offset.y;
  }

  set top(y) {
    this.pos.y = y - this.offset.y;
  }

  get left() {
    return this.pos.x + this.offset.x;
  }

  set left(x) {
    this.pos.x = x - this.offset.x;
  }

  get right() {
    return this.pos.x + this.size.x + this.offset.x;
  }

  set right(x) {
    this.pos.x = x - (this.size.x + this.offset.x);
  }

  get center() {
    return new Vec2(this.left + this.size.x / 2, this.top + this.size.y / 2);
  }
}
