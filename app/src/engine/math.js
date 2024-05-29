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

  delete(x, y) {
    const col = this.grid[x];

    if (col) {
      delete col[y];
    }
  }
}

export class Vec2 {
  constructor(x, y) {
    this.set(x, y);
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
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

  scale(f) {
    this.x *= f;
    this.y *= f;
    return this;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }

  normalize() {
    var len = this.length();
    if (len > 0) {
      this.scale(1 / len);
    }

    return this;
  }

  limit(s) {
    var len = this.length();

    if (len > s && len > 0) {
      this.scale(s / len);
    }
  
    return this;
  }

  dir() {
    return Math.atan2(this.y, this.x);
  }
}