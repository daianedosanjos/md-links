import fs from 'fs';
import pathNode from 'node:path';
import fetch from 'node-fetch';

const getAbsolutePath = (userPath) => {
let pathAbsolute = '';
if(!userPath){
    return false;
}if(pathNode.isAbsolute(userPath)){
    pathAbsolute = userPath;
}else{
    pathAbsolute = pathNode.resolve(userPath);
}
return pathAbsolute;
};


const getFiles = (path) => {
    let files = [];
        if(fs.statSync(path).isFile()){
            files.push(path);
        }
        else if(fs.statSync(path).isDirectory()){
            const filesInDir = fs.readdirSync(path);
            filesInDir.forEach( file => {
                    const pathDir = pathNode.join(path, file);
                    files = files.concat(getFiles(pathDir));
            });
        }
    return files;
};

const getMdFiles = (arrayFiles) => {
    const mdFiles = arrayFiles.filter( file => pathNode.extname(file) === '.md');
    return mdFiles;
};
function trataErro(erro) {
    console.log(erro);
    throw new Error(chalk.red(erro.code, 'Não há arquivo no diretório'));
  }
  
const readFiles = (caminhoDoArquivo) => {
    const enconding = 'utf-8';
    const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  
    return fs.promises.readFile(caminhoDoArquivo, enconding)
      .then((texto) => {
        const capturas = [...texto.matchAll(regex)];
        const resultados = capturas.map((captura) => ({
            file: caminhoDoArquivo,
            text: captura[1],
            href: captura[2],
         
          
        }));
        return resultados;
      })
      .catch((erro) => trataErro(erro));
  };

// Percorre o array de arquivos e retorna as promessas
const loopFilesMd = (arrayMd) => {
    let arrayPromises =  arrayMd.map((file)=>{
        return readFiles(file);
    });
    return Promise.all(arrayPromises).then(res=>res.flat());
};

// Validar Links 
const httpLinks = (allLinks) => {
let promisesLinks = allLinks.map(link => {
    return fetch(link.href) 
    .then(res => {
        if (res.status === 200 ){
            return ({ href: link.href,
                      file: link.file, 
                      text: link.text, 
                      status: res.status, 
                      OK: "OK✅" 
                    });
        }
        else if( res.status >= 400 && res.status < 600){
            return ({ href: link.href,
                file: link.file, 
                text: link.text, 
                status: res.status, 
                OK: "FAIL❌"});
        }
    });
});
    return Promise.all(promisesLinks);
 };


const getUniqueLinks = (arrayLinks) =>{
    const uniqueLinks = arrayLinks.reduce((counter, link)=>{
        counter[link.href] = ++counter[link.href] || 0;
        return counter;
    }, {});
    
    const linksDuplicates = arrayLinks.filter( (link) =>{
        return uniqueLinks[link.href];} );
        const linksUniques =  arrayLinks.length - linksDuplicates.length;
        return linksUniques;
};


const statsLinks = (links) => {
 const total = {
       'Total' : links.length,
       'Unique' : getUniqueLinks(links)   
    };
   
    return total;
   };

const validateStatsLinks = (links)=>{
    const linksBrokens = links.filter( link => link.OK === "FAIL❌" );
    const total = {
        'Total' : links.length,
        'Unique' : getUniqueLinks(links), 
        'Broken' : linksBrokens.length
     };
     return total;
};

export {
    getAbsolutePath,
    getFiles,
    getMdFiles,
    loopFilesMd,
    httpLinks,
    statsLinks,
    validateStatsLinks,
    getUniqueLinks,
    readFiles
};
