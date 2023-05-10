import { mdLinks } from '../src/index.js';
import {
  getAbsolutePath,
  getFiles,
  getMdFiles,
  httpLinks,
  getUniqueLinks,
  statsLinks,
  validateStatsLinks,
} from '../src/functions.js';

const relativePath = "arquivos"
const absolutePath = "C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos";
const files = [
  "C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos\\arquivo-sem-link.md", 
  "C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos\\arquivo-vazio.md", 
  "C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos\\arquivo.md",   
  "C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos\\arquivo.txt"
]
const mdFiles = [
  "C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos\\arquivo-sem-link.md", 
  "C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos\\arquivo-vazio.md", 
  "C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos\\arquivo.md", 
  
]
const defaultArray = [
  { 
    file: "C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos\\arquivo.md", 
    text:  "Node.js",
    href: "https://nodejs.org/",  
    
  },
  {
    file: "C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos\\arquivo.md",
    text: "Link quebrado",
    href: "https://555555",   
  }
];
 const arrayValidate = [
  { 
    file:  "../arquivos/arquivo.md", 
    text:  "Node.js",
    href: "https://nodejs.org/",        
    status: 200, 
    OK: "OK"
  },
  {
  file:  "../arquivos/arquivo.md", 
  text:  "Link quebrado",
  href: "https://555555",    
  status: 404, 
  OK: "fail"
  }
];

const uniqueLinksArray = [
  { 
  file:  "../arquivos/arquivos.md", 
  text:  "Node.js",
  href: "https://nodejs.org/",  
 
  },
  {
  file:  "../arquivos/arquivos.md", 
  text:  "Link quebrado",
  href: "https://555555", 
 
  },
];
  
const statsLinksArray = {
    'Total' : 2,
    'Unique' : 2  
};

const statsValidateLinksArray = {
    'Total' : 2,
    'Unique' : 2,
    'Broken' : 0
};


describe('MdLinks', () => {
   it('com caminho absoluto, deve retornar uma promessa', ()=>{
    mdLinks("./arquivos").then((res) =>{
     expect(res).toEqual(defaultArray);
    });
  })
  
  it('deve retornar um erro se o caminho for inválido', ()=>{
      expect(mdLinks("arquivos")).rejects.toMatch("❌ Caminho inválido, digite um caminho válido. "); //para decodificar o motivo de uma promessa rejeitada
  });

  it('se não tiver arquivos md deve rejeitar "sem arquivos md"', ()=>{
      expect(mdLinks("C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos\\arquivo.txt")).rejects.toMatch('sem arquivos md');
  });

  it('se não tiver arquivos md deve rejeitar "sem arquivos md"', ()=>{
      expect(mdLinks("./arquivos/arquivo.md" , {validate: true})).rejects.toMatch('sem arquivos md');
  });

  it('com caminho relativo, deve retornar uma promessa', ()=> {
    mdLinks("./arquivos/arquivo.md").then((res) =>{
     expect(res).toEqual(defaultArray);
    });
  });
});

describe('MdLinks com --validate', ()=>{
   it('deve retornar um objeto com href,file,status e Ok o Fail message', ()=>{
    mdLinks("./arquivos/arquivo.md" , {validate: true}).then((res)=>{
      expect(res).toEqual(arrayValidate);
    });
   });
});


describe('getUniqueLinks', ()=>{
   it('deve retornar o número de links únicos', ()=>{
    expect(getUniqueLinks(uniqueLinksArray)).toBe(2);
   });
});

describe('statsLinks', ()=>{
  it('uma matriz de 2 links, deve retornar 2 links exclusivo', ()=>{
    expect(statsLinks(uniqueLinksArray)).toEqual(statsLinksArray);
  });

    it('ValidStatsLinks deve retornar os links totais, únicos e quebrados', ()=>{
      expect(validateStatsLinks(uniqueLinksArray)).toEqual(statsValidateLinksArray);
    });
});

describe('httpLinks', ()=>{
   it('retorna uma promessa com links validados', ()=>{
    httpLinks(defaultArray).then((res) =>{
      expect(res).toEqual(arrayValidate);
    });
   });
})


describe('getAbsolutePath', () => {
    it('caminho relativo convertido em caminho absoluto', () => {
      expect(getAbsolutePath(relativePath)).toBe("C:\\Users\\dayan\\Desktop\\LAB\\md-links\\arquivos");
    });

    it('caminho absoluto permanece o mesmo', () => {
      expect(getAbsolutePath(absolutePath)).toBe(absolutePath);
    });

    it('Caminho vazio retorna falso', ()=>{
      expect(getAbsolutePath("")).toBeFalsy()
    })
});

describe('getFiles e MdFiles', ()=>{
  it('deve retornar o array de arquivos', ()=>{
    expect(getFiles(absolutePath)).toEqual(files)
  })

  it('deve retornar a matriz de arquivos md', ()=>{
    expect(getMdFiles(files)).toEqual(mdFiles)
  })
})

