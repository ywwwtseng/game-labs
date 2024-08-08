class ArrayUtil {
  static uniq(array) {
    return Array.from(new Set(array));
  }

  static range(...T) {
    let start, end;

    if (T.length === 1) {
      start = 0;
      end = T[0];
    } else {
      start = T[0];
      end = T[1];
    }

    return {
      map: function(callback) {
        const array = [];
        for (let index = start; index < end; index++) {
          array.push(callback(index));
        }

        return array;
      },
      forEach: function(callback) {
        for (let index = start; index < end; index++) {
          callback(index);
        }
      },
    }
  }
}

export { ArrayUtil };
