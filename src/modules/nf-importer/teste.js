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
  for (let index = 0; index < cnpj.length; index++) {
    for (let j = 0; j < tipoXml.length; j++) {
      var l2 = listarArquivosEPastasDeUmDiretorio(`./NFESIEG/XML/${tipoXml[j]}/${cnpj[index]}`)
      if(l2 != undefined)
      {
          for (let i = 0; i < l2.length; i++) {
          if(l2 != undefined)
          l1.push(l2[i]);
          
        } 
      }
        
    }
    
  }
  return l1
}

const cnpj =  [ '10498061000184',
'32972772000181',
'05612537000126',
'05612537000207',
'05612537000479',
'24649946000141',
'29556841000161',
'29556841000242',
'29554321000110'
 ]
const tipoXml = ['nfe','cte','nfes']
//  let lista = listarArquivosEPastasDeUmDiretorio(`./NFESIEG/XML/nfe/29554321000110`);
//  console.log(lista)
async function importerXmls(cnpj, xmlType){
  try {
    let defaultConfig = { skip: 0, limit: 50 };
    let initialConfig = { ...defaultConfig };
    let stopLoop = false;
    const events = [];

    const licenseData = await auth.getLicenseData();
   // let lista = listarArquivosEPastasDeUmDiretorio(`./NFESIEG/XML/${xmlType}/${cnpj}`);
    while (stopLoop === false) {
          //console.log("entrou")
       //let lista = listarArquivosEPastasDeUmDiretorio(`./NFESIEG/XML/${xmlType}/${cnpj}`);
      // if (lista === undefined) {
      //  console.log('erro')
      // } 
      //else {
        var jsonArr = []; 
       
        await Promise.all(        
        async (xml) => {
          let parsedXml = "";
        fs.readFile(xml, (err, data) => {           
          parser.parseString(
            Buffer.from(data, "base64").toString("utf8"),
            async (err, result) => {
              parsedXml = result
              //object
             
            }
            );
            console.log(parsedXml) ;
        }); 
        console.log(parsedXml) ;  
        var json = "";
        switch (xmlType) {
          case "nfe":
            json = await handlingNfe.makeJson({
              cnpj: cnpj,
              xml: parsedXml,
            });            
            console.log('Entrou')
            break;
          case "nfse":
            json = await handlingNfse.makeJson({
              cnpj: cnpj,
              xml: parsedXml,
            });
            break;
          case "cte":
            json = await handlingCte.makeJson({
              cnpj: cnpj,
              xml: parsedXml,
            });
            break;
          default:
            console.log("Tipo de nota não mapeado", xmlType);
            break;
        }
             console.log("JSON" +json)       
      if (json.hasOwnProperty("error")) {
        console.log(json.error);//<-
      } else {
        jsonArr.push({ ...json });
        events.push({
          nfDate: json.SF1.F1_EMISSAO,
          nfNumber: json.SF1.F1_DOC,
          cnpj,
          type: xmlType,
          blob: xml,
        });
      }  
    }
    )      

  if (!_.isEmpty(jsonArr)) {
    nfImportSpinner.message("Importando Lote");
    await protheus.importerNfs(licenseData, jsonArr);
    await exporter.main(events);
  }
  jsonArr.length === 50
  ? (initialConfig.skip += 1)
  : ((stopLoop = true), (initialConfig = { ...defaultConfig }));

  jsonArr.length === 0
  ? ((stopLoop = true), (initialConfig = { ...defaultConfig }))
  : false;
               
        
      
    
    } 
    return events;
  } catch (error) {
    console.log(error);
    return null;
  }
};
 var s =listar(cnpj,tipoXml);
 //console.log(s)
 //console.log(s[1])
var parsedXml = ""
const c = 29554321000110
const a = 2021
const m = 1 

    fs.readFile(`./NFESIEG/XML/nfe/${c}/${a}/${m}/${s[1]}`, (err, xml) => {      
        parser.parseString(
        Buffer.from(xml, "base64").toString("utf8"),
        async (err, result) => {
          parsedXml = result 
               console.log(result)    
        }
        );  
      })  
           

	// fs.readFile(`./NFESIEG/XML/nfe/${c}/${a}/${m}/${s[1]}`, function(err,data){
	// parser.parseString(data,function(err,result){
  //   console.log(result);
  // })
		
	// });
 
//importerXmls(cnpj,'nfe');

//---------------------------------------------------------------------------
// function readFilePromise(fileName) {
//   return new Promise((resolve, reject) => {
//       fs.readFile(fileName, (err, res)=> {
//           if (err) reject(err);
//           else {            
//             parser.parseString(
//               Buffer.from(res, "base64").toString("utf8"),
//               async (err, result) => {                
//                  resolve(result)                
//               }
//               );
//           }
//       });
//   });
// }
// readFilePromise(`./NFESIEG/XML/nfe/${c}/${a}/${m}/${s[1]}`)
//     .then(res => console.log(res))
//     .catch(err => console.error(err));