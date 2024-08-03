class ArrayUtil {
  static uniq(array) {
    return Array.from(new Set(array));
  }
}

export { ArrayUtil };
