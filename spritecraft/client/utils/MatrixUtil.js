import range from "lodash-es/range";

class MatrixUtil {
  static forEach(matrix, callback) {
    matrix.forEach((column, x) => {
      column.forEach((value, y) => {
        if (value) {
          callback(value, x,  y);
        }
      });
    });
  }

  static range(maxIndex, callback) {
    return range(maxIndex[1] + 1).map((y) =>
      range(maxIndex[0] + 1).map((x) => callback(x, y))
    );
  }

  static traverse(maxIndex, callback) {
    return range(maxIndex[1] + 1).forEach((y) =>
      range(maxIndex[0] + 1).forEach((x) => callback(x, y))
    );
  }

  static createByIndex(index, callback) {
    const matrix = [];
    MatrixUtil.traverse(index, (x, y) => {
      if (!matrix[x]) {
        matrix[x] = [];
      }

      matrix[x][y] = callback(x, y);
    });

    return matrix;
  }
}

export { MatrixUtil };