class Vec2Util {
  static get unit() {
    return {
      x: 1,
      y: 1,
    };
  }

  static calc(vec1, { sub, add }) {
    let x = vec1.x;
    let y = vec1.y;
    if (sub) {
      x = x - sub.x;
      y = y - sub.y;
    }

    if (add) {
      x = x + add.x;
      y = y + add.y;
    }

    return {
      x,
      y,
    };
  }

  static diff(vec1, vec2) {
    return vec1[0] !== vec2[0] || vec1[1] !== vec2[1];
  }
}

export { Vec2Util };
