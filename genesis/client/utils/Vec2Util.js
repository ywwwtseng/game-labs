class Vec2Util {
  static sub(vec1, vec0) {
    return {
      x: vec1.x - vec0.x,
      y: vec1.y - vec0.y,
    }
  }
}

export { Vec2Util };