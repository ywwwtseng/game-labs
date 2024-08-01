import range from "lodash-es/range";

class MatrixUtil {
  static isMatrix(matrix) {
    return Array.isArray(matrix) && Array.isArray(matrix.filter(Boolean)[0]);
  }

  static sizeIndex(T) {
    if (MatrixUtil.isMatrix(T)) {
      const matrix = T;
      return [matrix.length, matrix[0].length];
    } else if (T.length === 4) {
      const rect = T;
      return [rect[2], rect[3]];
    }
  }

  static size(T) {
    if (MatrixUtil.isMatrix(T)) {
      const matrix = T;
      return {
        x: matrix.length * 16,
        y: matrix[0].length * 16
      };
    } else if (T.length === 4) {
      const rect = T;
      return {
        x: rect[2] * 16,
        y: rect[3] * 16
      };
    }
  }

  static map(T, callback) {
    if (T.length === 0) {
      return T;
    } else if (MatrixUtil.isMatrix(T)) {
      return MatrixUtil._mapByMatrix(T, callback);
    } else if (T.length === 2) {
      return MatrixUtil._mapBySizeIndex(T, callback);
    }
  }

  static _mapByMatrix(matrix, callback) {
    return matrix.map((column, x) => {
      return column.map((value, y) => {
        if (value) {
          return callback(value, x, y);
        }
      });
    });
  }

  static _mapBySizeIndex(size, callback) {
    return range(size[1]).map((y) =>
      range(size[0]).map((x) => callback(x, y))
    );
  }

  static traverse(T, callback) {
    if (MatrixUtil.isMatrix(T)) {
      MatrixUtil._traverseMatrix(T, callback);
    } else if (T.length === 4) {
      MatrixUtil._traverseRect(T, callback);
    } else if (T.length === 2) {
      MatrixUtil._traverseBySizeIndex(T, callback);
    }
  }

  static _traverseMatrix(matrix, callback) {
    matrix.forEach((column, x) => {
      column.forEach((value, y) => {
        if (value) {
          callback({ value, x, y });
        }
      });
    });
  }

  static _traverseBySizeIndex(sizeIndex, callback) {
    range(sizeIndex[1]).forEach((y) =>
      range(sizeIndex[0]).forEach((x) => callback({ x, y }))
    );
  }

  static _traverseRect(rect, callback) {
    range(rect[3]).forEach((y) =>
      range(rect[2]).forEach((x) => callback({x, y}, {x: rect[0] + x, y:rect[1] + y}))
    );
  }

  static create(T, callback) {
    if (T.length === 2) {
      return MatrixUtil._createBySizeIndex(T, callback);
    } else if (T.length === 4) {
      return MatrixUtil._createBySizeIndex([T[2], T[3]], callback);
    }
  }

  static _createBySizeIndex(sizeIndex, callback) {
    const matrix = [];
    MatrixUtil.traverse(sizeIndex, ({x, y}) => {
      if (!matrix[x]) {
        matrix[x] = [];
      }

      matrix[x][y] = callback(x, y);
    });

    return matrix;
  }

  static findIndex(matrix, callback) {
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
}

export { MatrixUtil };
