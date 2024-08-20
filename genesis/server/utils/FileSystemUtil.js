import fs from 'fs';
import path from 'path';

class FileSystemUtil {
  static writeFile(pathname, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join('public', pathname), JSON.stringify(data), (error) => {
        if (error) {
          reject(error);
        }

        resolve();
      });
    });
  }

  static readFile(pathname, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join('public', pathname), encoding, (error, data) => {
        if (error) {
          reject(error);
        }

        resolve(JSON.parse(data || {}));
      });
    });
  }
}

export default FileSystemUtil;