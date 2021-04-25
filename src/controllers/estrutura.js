const fs = require('fs');
const knex = require('../database/connection');


async function criarTxt(cod, qtd,desc){
fs.appendFile(process.cwd()+'/arquivos/produto.txt',`\r\n${cod};${qtd};${desc}`,(erro)=>{
if(erro){
    console.log(erro)
}else{
    console.log("ok")
}
})
}

module.exports ={criarTxt} 