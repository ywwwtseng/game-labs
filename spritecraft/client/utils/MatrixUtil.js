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

  static range(matrix, callback) {
    return range(matrix[1] + 1).map((y) =>
      range(matrix[0] + 1).map((x) => callback(x, y))
    );
  }
}

export { MatrixUtil };