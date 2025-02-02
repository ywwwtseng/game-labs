class ObjectUtil {
  static equals(object1, object2) {
    return Object.keys(object1).every((key) =>  object1[key] === object2[key]);
  }
}

export { ObjectUtil };