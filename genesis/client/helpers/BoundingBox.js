import { CanvasUtil } from '@/utils/CanvasUtil';
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

function getBoundingBox(T) {
  if (T instanceof HTMLElement) {
    const { left, top, width, height } = T.getBoundingClientRect();
    const pos = { x: left, y: top };
    const size = { x: width, y: height };

    return new BoundingBox({ pos, size });
  }

  if (T?.event && T?.rect) {
    const size = MatrixUtil.size(CanvasUtil.normalizeRect(T.rect));
    const pos = {
      x: T.event.pageX - size.x / 2, 
      y: T.event.pageY - size.y / 2,
    };

    return new BoundingBox({ pos, size });
  }

  if (T?.rect && T?.canvas) {
    const { left, top } = T.canvas.getBoundingClientRect();
    const rect = CanvasUtil.normalizeRect(T.rect);
    const [indexX, indexY] = rect;
    const pos = {
      x: left + indexX * 16,
      y: top + indexY * 16,
    };
    const size = MatrixUtil.size(rect);
    return new BoundingBox({ pos, size });
  }

  if (T?.rect || T?.length === 4) {
    const rect = CanvasUtil.normalizeRect(T.rect || T);
    const [indexX, indexY] = rect;
    const pos = {
      x: indexX * 16,
      y: indexY * 16,
    };
    const size = MatrixUtil.size(rect);
    return new BoundingBox({ pos, size });
  }

  return T;
}

function overlaps(T1, T2) {
  return getBoundingBox(T1).overlaps(getBoundingBox(T2));
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
