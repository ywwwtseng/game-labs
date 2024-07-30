class Vec2Util {
  static calc(vec1, { sub }) {
    if (sub) {
      return {
        x: vec1.x - sub.x,
        y: vec1.y - sub.y,
      }
    }
  }
}

export { Vec2Util };