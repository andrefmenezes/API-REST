const fs = require('fs');
const error = require("../modules/error");
const global = require("../config/global");
const auth = require("../modules/auth");
const axios = require("axios");
const knex = require('../database/connection');
const produto =  knex('table_prod').select('*');

async function criar(cod, qtd,desc){
fs.appendFile(process.cwd()+'/arquivos/produto.txt',`\r\n${cod};${qtd};${desc}`,(erro)=>{
if(erro){
    console.log(erro)
}else{
    console.log("ok")
}
})
}
const validateApis = async () => {
    const licenseData = await auth.getLicenseData();
  
    
  
    console.log("\nTestando conexão com o Protheus");
  
    //console.log(licenseData.protheusImporterApi)
  
    //console.log(licenseData.protheusUser)
  
    try {
      const protheusApi = await axios.default.post(
        licenseData.protheusImporterApi,
        [],
        {
          timeout: global.timeout.timeoutValidation,
          headers: {
            Authorization: `BASIC ${licenseData.protheusUser}`,
          },
        }
      );
  
      if (protheusApi.status === 200 || protheusApi.status === 201) {
        console.log("Conexão bem sucedida com o Protheus");
      } else {
       // logger.error(err);
        await error.errorConnectProtheusApi();
      }
    } catch (err) {
      //logger.error(err);
      await error.errorConnectProtheusApi();
    }
  };
  // const main = async () => {
  // await validateApis();
  // }
  // main();
module.exports ={criar,validateApis} 