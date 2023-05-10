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
      
        const pathUser = getAbsolutePath(path);
        const allFiles = getFiles(pathUser);
        const allMdFiles = getMdFiles(allFiles);
        if (allMdFiles.length === 0) {
          reject(chalk.bgRed.bold("sem arquivos md"));
        }             
        loopFilesMd(allMdFiles)
        .then((result) =>{ 
          if (options.validate){
            return httpLinks(result)
          }
          return result
        })
        .then((result) => resolve(result))
        .catch((error) =>{
          if (error.code == "ENOENT") {
            reject(chalk.bgRed.bold("❌ Caminho inválido, digite um caminho válido."));
          }
          reject(chalk.bgRed.bold("❌ Error "));        
        })
        
      
    
    });
  };

