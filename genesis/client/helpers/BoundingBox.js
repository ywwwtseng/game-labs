import { CanvasUtil } from '@/utils/CanvasUtil';
import { DomUtil } from '@/utils/DomUtil';
import { MatrixUtil } from '@/utils/MatrixUtil';

class BoundingBox {
  constructor({ pos, size }) {
    this.pos = pos;
    this.size = size;
  }

  get bottom() {
    return this.pos.y + this.size.y;
  }

  set bottom(y) {
    this.pos.y = y - this.size.y;
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
    this.pos.x = x - this.size.x;
  }

  get center() {
    return { x: this.left + this.size.x / 2, y: this.top + this.size.y / 2 };
  }
}

function getBoundingBox(T) {
  if (typeof T === 'string') {
    const el = document.getElementById(T);
    const { left, top, width, height } = el.getBoundingClientRect();
    const pos = { x: left, y: top };
    const size = { x: width, y: height };

    return new BoundingBox({ pos, size });
  }

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

  if (T?.rect && T?.with) {
    const { left, top } = DomUtil.getEl(T.with).getBoundingClientRect();
    const rect = CanvasUtil.normalizeRect(T.rect);
    const [indexX, indexY] = rect;
    const pos = {
      x: left + indexX * 16,
      y: top + indexY * 16,
    };
    const size = MatrixUtil.size(rect);
    return new BoundingBox({ pos, size });
  }

  if (T?.bounds && T?.with) {
    const { left, top } = DomUtil.getEl(T.with).getBoundingClientRect();
    const pos = {
      x: left + T.bounds.x,
      y: top + T.bounds.y,
    };
    const size = {
      x: T.bounds.width,
      y: T.bounds.height,
    };
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

  // if (T instanceof Event) {
  const size = { x: 1, y: 1 };
  const pos = {
    x: T.pageX,
    y: T.pageY,
  };

  return new BoundingBox({ pos, size });
  // }
}

function overlaps(T1, T2) {
  const bounds_1 = getBoundingBox(T1);
  const bounds_2 = getBoundingBox(T2);

  return (
    bounds_1.bottom > bounds_2.top &&
    bounds_1.top < bounds_2.bottom &&
    bounds_1.left < bounds_2.right &&
    bounds_1.right > bounds_2.left
  );
}

function completely_contain(inner, { in: outer }) {
  const outer_bounds = getBoundingBox(outer);
  const inner_bounds = getBoundingBox(inner);

  return (
    outer_bounds.top < inner_bounds.top &&
    outer_bounds.bottom > inner_bounds.bottom &&
    outer_bounds.left < inner_bounds.left &&
    outer_bounds.right > inner_bounds.right
  );
}

function contain(inner, { in: outer }) {
  const outer_bounds = getBoundingBox(outer);
  const inner_bounds = getBoundingBox(inner);

  return (
    outer_bounds.top <= inner_bounds.top &&
    outer_bounds.bottom >= inner_bounds.bottom &&
    outer_bounds.left <= inner_bounds.left &&
    outer_bounds.right >= inner_bounds.right
  );
}

export { BoundingBox, getBoundingBox, overlaps, contain, completely_contain };
