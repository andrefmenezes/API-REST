const axios = require("axios");
const _ = require("lodash");
const prompts = require("prompts");
const moment = require("moment");
const clui = require("clui");
const Promise = require("bluebird");
const auth = require("../auth");
const error = require("../error");
const global = require("../../config/global");
const eventModel = require("../../database/models/event");
const logger = require("../../config/logger");
const xml2js = require("xml2js");
const parser = new xml2js.Parser();
const handlingNfse = require("../handling/handling-nfse");
const handlingNfe = require("../handling/handling-nfe");
const handlingCte = require("../handling/handling-cte");
const protheus = require("../../modules/protheus");
const dateFns = require("date-fns");
const fs = require('fs');
const exporter = require("../../modules/nf-exporter");
const { data } = require("../../config/logger");
const util = require('util')
const cli = clui.Spinner;
var nfImportSpinner = new cli("", "");
function listarArquivosEPastasDeUmDiretorio(diretorio, arquivos) {
    try {
      if(!arquivos)
      arquivos = [];
  
  let listaDeArquivos = fs.readdirSync(diretorio);
  for(let k in listaDeArquivos) {
      let stat = fs.statSync(diretorio + '/' + listaDeArquivos[k]);
      if(stat.isDirectory())
          listarArquivosEPastasDeUmDiretorio(diretorio + '/' + listaDeArquivos[k], arquivos);
      else
          arquivos.push(listaDeArquivos[k]);
          // arquivos.push(diretorio + '/' + listaDeArquivos[k]); ./NFESIEG/XML/NFE/29554321000110/2021/01/10127.xml
  }
  
  return arquivos;
    } catch (error) {
      
    }
  
  
  }
  
  function listar(cnpj,tipoXml){
    var l1 = []
   
        var l2 = listarArquivosEPastasDeUmDiretorio(`./NFESIEG/XML/${tipoXml}/${cnpj}`)
        if(l2 != undefined)
        {
            for (let i = 0; i < l2.length; i++) {
            if(l2 != undefined)
            l1.push(l2[i]);
            
          } 
        }
          
    
      
   
    return l1
  }

 async  function importer(cnpj,intervalDate,tipoXml){
  var list = listar(cnpj,tipoXml);
    await Promise.all(      
    list.forEach(async (number)=>{
      let parsedXml = "";
      fs.readFile(`./NFESIEG/XML/nfe/${cnpj}/2021/1/${number}`, (err, xml) => {      
        parser.parseString(
      Buffer.from(xml, "base64").toString("utf8"),
      async (err, result) => {
          //console.log('RESULT', result)
           parsedXml = result                       
      });     
        })
        console.log('@@@@@@',parsedXml)
      })
      
    )
    
}
const cnpj = '29554321000110'
const intervalDate = [
    moment().subtract(1, "day").format("YYYY-MM-DD"),
    moment().subtract(1, "day").format("YYYY-MM-DD"),
  ]
const tipo = 'nfe'
//importer(cnpj,intervalDate,tipo)

//console.log(jsonData)
async function a(c,t){
  var list = listar(c,t);
  var jsonData = fs.readFileSync(`./NFESIEG/XML/nfe/${c}/2021/1/${list[0]}`, "utf8");
  await handlingNfe.makeJson({
    cnpj: cnpj,
    xml: jsonData,
  })
}
 a(cnpj,tipo)