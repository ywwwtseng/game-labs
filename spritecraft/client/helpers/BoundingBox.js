class BoundingBox {
  constructor(el) {
    const { left, top, width, height } = el.getBoundingClientRect();
    this.pos = { x: left, y: top };
    this.size = { x: width, y: height };
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

export { BoundingBox };
