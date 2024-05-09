export class Matrix {
  constructor() {
    this.grid = [];
  }

  forEach(callback) {
    this.grid.forEach((column, x) => {
      column.forEach((value, y) => {
        callback(value, x, y);
      });
    });
  }

  get(x, y) {
    const col = this.grid[x];

    if (col) {
      return col[y];
    }

    return undefined;
  }

  set(x, y, value) {
    if (!this.grid[x]) {
      this.grid[x] = [];
    }

    this.grid[x][y] = value;
  }
}

export class Vec2 {
  constructor(x, y) {
    this.set(x, y);
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  dir() {
    return Math.atan2(this.y, this.x);
  }
}