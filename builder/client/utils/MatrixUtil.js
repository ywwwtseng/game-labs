import { ArrayUtil } from '@/utils/ArrayUtil';

class MatrixUtil {
  static isMatrix(matrix) {
    return Array.isArray(matrix) && Array.isArray(matrix.filter(Boolean)[0]);
  }

  static sizeCount(T) {
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
        y: matrix[0].length * 16,
      };
    } else if (T.length === 4) {
      const rect = T;
      return {
        x: rect[2] * 16,
        y: rect[3] * 16,
      };
    }
  }

  static map(T, callback) {
    if (T.length === 0) {
      return T;
    } else if (MatrixUtil.isMatrix(T)) {
      return MatrixUtil._mapByMatrix(T, callback);
    } else if (T.length === 2) {
      return MatrixUtil._mapBySizeCount(T, callback);
    }
  }

  static _mapByMatrix(matrix, callback) {
    return matrix.map((column, x) => {
      return column.map((value, y) => {
        if (value) {
          return callback({value, x, y});
        }
      });
    });
  }

  static _mapBySizeCount(size, callback) {
    return ArrayUtil.range(size[1]).map((y) => ArrayUtil.range(size[0]).map((x) => callback({x, y})));
  }

  static traverse(T, callback) {
    if (MatrixUtil.isMatrix(T)) {
      MatrixUtil._traverseMatrix(T, callback);
    } else if (T.length === 4) {
      MatrixUtil._traverseRect(T, callback);
    } else if (T.length === 2) {
      MatrixUtil._traverseBySizeCount(T, callback);
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

  static _traverseBySizeCount(sizeCount, callback) {
    ArrayUtil.range(sizeCount[1]).forEach((y) =>
      ArrayUtil.range(sizeCount[0]).forEach((x) => callback({ x, y })),
    );
  }

  static _traverseRect(rect, callback) {
    ArrayUtil.range(rect[3]).forEach((y) =>
      ArrayUtil.range(rect[2]).forEach((x) =>
        callback({ x, y }, { x: rect[0] + x, y: rect[1] + y }),
      ),
    );
  }

  static create(T, callback, offset) {
    if (MatrixUtil.isMatrix(T)) {
      const rect = [0, 0, ...MatrixUtil.sizeCount(T)];
      return MatrixUtil.create(
        rect,
        ({ x, y }) => {
          const value = T?.[x]?.[y];
          return callback({ value, x, y });
        },
        offset,
      );
    }
    if (T.length === 2) {
      return MatrixUtil._createBySizeCount(
        T,
        callback,
        { x: 0, y: 0 },
      );
    } else if (T.length === 4) {
      return MatrixUtil._createBySizeCount(
        [T[2], T[3]],
        callback,
        { x: T[0], y: T[1] },
      );
    }
  }

  static _createBySizeCount(sizeCount, callback, offset = { x: 0, y: 0 }) {
    const matrix = [];
    MatrixUtil.traverse(sizeCount, ({ x, y }) => {
      if (!matrix[x]) {
        matrix[x] = [];
      }

      matrix[x][y] = callback({ x, y }, { x: x + offset.x, y: y + offset.y });
    });

    return matrix;
  }

  static findIndexArray(matrix, callback) {
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

  static findIndex(matrix, callback) {
    for (let y = 0; y < matrix.length; y++) {
      const column = matrix[y];

      for (let x = 0; x < column.length; x++) {
        if (callback(column[x], x, y)) {
          return [x, y];
        }
      }
    }
  }
}

export { MatrixUtil };
