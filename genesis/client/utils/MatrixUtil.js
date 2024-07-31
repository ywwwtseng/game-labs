import range from "lodash-es/range";

class MatrixUtil {
  static forEach(matrix, callback) {
    matrix.forEach((column, x) => {
      column.forEach((value, y) => {
        if (value) {
          callback(value, x, y);
        }
      });
    });
  }

  static map(matrix, callback) {
    return matrix.map((column, x) => {
      return column.map((value, y) => {
        if (value) {
          return callback(value, x, y);
        }
      });
    });
  }

  static find(matrix, callback) {
    const array = [];

    matrix.forEach((column, x) => {
      column.forEach((value, y) => {
        if (callback(value, x, y)) {
          array.push([x, y]);
        }
      });
    });

    return array;

  }

  static rangeByIndex(maxIndex, callback) {
    return range(maxIndex[1] + 1).map((y) =>
      range(maxIndex[0] + 1).map((x) => callback(x, y))
    );
  }

  static traverse(size, callback) {
    return range(size[1]).forEach((y) =>
      range(size[0]).forEach((x) => callback(x, y))
    );
  }

  static traverseByIndex(maxIndex, callback) {
    return range(maxIndex[1] + 1).forEach((y) =>
      range(maxIndex[0] + 1).forEach((x) => callback(x, y))
    );
  }

  static traverseRect(rect, callback) {
    MatrixUtil.traverse([rect[2], rect[3]], callback);
  }

  static createByIndex(maxIndex, callback) {
    const matrix = [];
    MatrixUtil.traverseByIndex(maxIndex, (x, y) => {
      if (!matrix[x]) {
        matrix[x] = [];
      }

      matrix[x][y] = callback(x, y);
    });

    return matrix;
  }

  static createBySize(size, callback) {
    return MatrixUtil.createByIndex([size[0] - 1, size[1] - 1], callback);
  }

  static createByRect(rect, callback) {
    return MatrixUtil.createBySize([rect[2], rect[3]], callback);
  }
}

export { MatrixUtil };
