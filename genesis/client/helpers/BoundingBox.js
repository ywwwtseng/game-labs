import { MatrixUtil } from '@/utils/MatrixUtil';

class BoundingBox {
  constructor({ pos, size }) {
    this.pos = pos;
    this.size = size;
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
    return this.pos.y + this.size.y;
  }

  set bottom(y) {
    this.pos.y = y - (this.size.y);
  }

  get top() {
    return this.pos.y;
  }

  set top(y) {
    this.pos.y = y;
  }

  get left() {
    return this.pos.x;
  }

  set left(x) {
    this.pos.x = x;
  }

  get right() {
    return this.pos.x + this.size.x;
  }

  set right(x) {
    this.pos.x = x - (this.size.x);
  }

  get center() {
    return {x: this.left + this.size.x / 2, y: this.top + this.size.y / 2};
  }
}

function getBoundingBox(any) {
  if (any instanceof HTMLElement) {
    const { left, top, width, height } = any.getBoundingClientRect();
    const pos = { x: left, y: top };
    const size = { x: width, y: height };

    return new BoundingBox({ pos, size });
  }

  if (any?.event && any?.rect) {
    const size = MatrixUtil.size(any?.rect);
    const pos = {
      x: any.event.pageX - size.x / 2, 
      y: any.event.pageY - size.y / 2,
    };

    return new BoundingBox({ pos, size });
  }

  if (any?.selectedArea && any?.canvas) {
    const { left, top } = any.canvas.getBoundingClientRect();
    const [indexX, indexY] = any.selectedArea;
    const pos = {
      x: left + indexX * 16,
      y: top + indexY * 16,
    };
    const size = MatrixUtil.size(any.selectedArea);
    return new BoundingBox({ pos, size });
  }

  return any;
}

function overlaps(any1, any2) {
  return getBoundingBox(any1).overlaps(getBoundingBox(any2));
}

function contain(outer, { in: inner }) {
  const outerBounds = getBoundingBox(outer);
  const innerBounds = getBoundingBox(inner);

  return outerBounds.top <= innerBounds.top
    && outerBounds.bottom >= innerBounds.bottom
    && outerBounds.left <= innerBounds.left
    && outerBounds.right >= innerBounds.right;
}

export { BoundingBox, getBoundingBox, overlaps, contain };
