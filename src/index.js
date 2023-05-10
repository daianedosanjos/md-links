import chalk from "chalk";
import {
  getAbsolutePath,
  getFiles,
  getMdFiles,
  loopFilesMd,
  httpLinks,
} from "./functions.js";

export const mdLinks = (path, options = 
  { validate: false }) => {
  return new Promise((resolve, reject) => {
    try {
      const pathUser = getAbsolutePath(path);
      const allFiles = getFiles(pathUser);
      const allMdFiles = getMdFiles(allFiles);
      if (options.validate == true) {
        if (allMdFiles.length === 0) {
          reject(chalk.bgRed.bold("sem arquivos md"));
        }
        loopFilesMd(allMdFiles)
          .then((res) => httpLinks(res))
          .then((res) => resolve(res));
      } else if (options.validate === false) {
        if (allMdFiles.length === 0) {
          reject(chalk.bgRed.bold("sem arquivos md"));
        }
        loopFilesMd(allMdFiles).then((res) => resolve(res));
      }
    } catch (error) {
      if (error.code == "ENOENT") {
        reject(chalk.bgRed.bold("❌ Caminho inválido, digite um caminho válido."));
      } else {
        reject(chalk.bgRed.bold("❌ Error "));
      }
      reject(error);
    }
  });
};

