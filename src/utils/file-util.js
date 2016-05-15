import jsonFile from 'jsonfile';
import fs from 'fs';
import fse from 'fs-extra';
import Path from 'path';
import mkdirp from 'mkdirp';

import logt from './log-template';
/**
 * Wrapper fs for promise
 */
class FileUtil {
  readJsonFilePromise(path) {
    return new Promise((resolve, reject) => {
      jsonFile.readFile(path, (err, obj) => {
        if (err) {
          reject(err);
        }
        resolve(obj);
      });
    });
  }

  readFilePromise(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf-8', (err, obj) => {
        if (err) {
          reject(err);
        }
        resolve(obj);
      });
    });
  }

  writeFilePromise(path, text, encoding) {
    return new Promise((resolve, reject) => {
      mkdirp(Path.dirname(path), (err) => {
        if (err) {
          reject(err);
        }
      });
      fs.writeFile(path, text, encoding, (err) => {
        if (err) {
          reject(err);
        }
        resolve(path);
      });
    });
  }

  writeResourcesPromise(path, dest) {
    return new Promise((resolve, reject) => {
      path = path.replace(/\.[^/.]+$/, "");
      mkdirp(path, (err) => {
        if (err) {
          reject(err);
        }
      });
      fse.copy(dest, path, function (err) {
        if (err) return logt.info(err);
        logt.info("success!")
      })
    });
  }

  isEqualTextOfTwoFiles(firstFilePath, secondFilePath) {
    return Promise.all(
      [
        this.readFilePromise(firstFilePath),
        this.readFilePromise(secondFilePath)
      ]
    )
      .then((results) => {
        return Promise.resolve(results[0] === results[1]);
      });
  }

  readDir(path) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        if (err) {
          reject(err);
        }
        resolve(files);
      })
    });
  }
}

export default new FileUtil();
