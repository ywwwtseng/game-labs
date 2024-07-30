class Vec2Util {
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
      x, y
    }
  }
}

export { Vec2Util };