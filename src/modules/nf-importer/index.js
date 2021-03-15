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

const cli = clui.Spinner;
var nfImportSpinner = new cli("", "");
const pc = false;
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
const importerXmls = async (cnpj, intervalDate, xmlType) => {
  try {
    let defaultConfig = { skip: 0, limit: 50, intervalDate };
    let initialConfig = { ...defaultConfig };
    let stopLoop = false;
    const events = [];

    const licenseData = await auth.getLicenseData();
    let lista = listarArquivosEPastasDeUmDiretorio(`./NFESIEG/XML/${xmlType}/${cnpj}`);
    while (stopLoop === false) {
    if(pc == true){
      //console.log("entrou")
      // let lista = listarArquivosEPastasDeUmDiretorio(`./NFESIEG/XML/${xmlType}/${cnpj}`);
      if (lista === undefined) {
      // console.log('erro')
      } else {
        let jsonArr = [];    
          let json = "";
            for (let index = 0; index < lista.length; index++) {      
              switch (xmlType) {
                case "nfe":
                  json = await handlingNfe.makeJson({
                    cnpj: cnpj,
                    xml: lista[index],
                  });
                  console.log(lista[index])
                  break;
                case "nfse":
                  json = await handlingNfse.makeJson({
                    cnpj: cnpj,
                    xml: lista[index],
                  });
                  break;
                case "cte":
                  json = await handlingCte.makeJson({
                    cnpj: cnpj,
                    xml: lista[index],
                  });
                  break;
                default:
                  console.log("Tipo de nota não mapeado", xmlType);
                  break;
              }
            }    
      
            if (json.hasOwnProperty("error")) {
              console.log(json.error);
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
      
        if (!_.isEmpty(jsonArr)) {
          nfImportSpinner.message("Importando Lote");
          await protheus.importerNfs(licenseData, jsonArr);
          await exporter.main(events);
        }
        lista.length === 50
        ? (initialConfig.skip += 1)
        : ((stopLoop = true), (initialConfig = { ...defaultConfig }));

        lista.length === 0
        ? ((stopLoop = true), (initialConfig = { ...defaultConfig }))
        : false;
      }
    }else{
         //Capturando as notas na SIEG
      const request = await catchXmlsRequest({
        apikey: licenseData.apikey,
        email: licenseData.apikeyemail,
        xmltype: xmlType,
        take: initialConfig.limit,
        skip: initialConfig.skip,
        dataInicio: initialConfig.intervalDate[0],
        dataFim: initialConfig.intervalDate[1],
        cnpjDest: cnpj,
      });

      //Verificando se tem error
      if (request.data.hasOwnProperty("Error")) {
        nfImportSpinner.stop();
        stopLoop = true;
        return await error.invalidApiKey();
      }

      if (!_.isEmpty(request.data.xmls)) {
        let jsonArr = [];
        //console.log(request.data.xmls)
        await Promise.all(
          
          request.data.xmls.map(async (xml) => {
            //console.log(xml)
            let parsedXml = "";
            
            parser.parseString(
              Buffer.from(xml, "base64").toString("utf8"),
              async (err, result) => {
                parsedXml = result;//object
              }
            );
            //console.log(parsedXml)
            let json = "";

            switch (xmlType) {
              case "nfe":
                json = await handlingNfe.makeJson({
                  cnpj: cnpj,
                  xml: parsedXml,
                });
                //console.log(parsedXml)
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

            if (json.hasOwnProperty("error")) {
              console.log(json.error);
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
          })
        );

        if (!_.isEmpty(jsonArr)) {
          nfImportSpinner.message("Importando Lote");
          await protheus.importerNfs(licenseData, jsonArr);
          await exporter.main(events);
        }
      }

      request.data.xmls.length === 50
        ? (initialConfig.skip += 1)
        : ((stopLoop = true), (initialConfig = { ...defaultConfig }));

      request.data.xmls.length === 0
        ? ((stopLoop = true), (initialConfig = { ...defaultConfig }))
        : false;
      }
    }

    return events;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const catchXmlsRequest = async (config) => {
  return axios.default.post(global.routes.siegCatchXmlsApi, { ...config });
};

const importerQuestions = async () => {
  const questions = [
    {
      type: "date",
      name: "startDate",
      mask: "DD-MM-YYYY",
      message: "Informe a data inicial de importação: ",
    },
    {
      type: "date",
      name: "endDate",
      mask: "DD-MM-YYYY",
      message: "Informe a data final de importação: ",
    },
  ];

  const response = await prompts(questions);
  const intervalDate = [
    moment(response.startDate).format("YYYY-MM-DD"),
    moment(response.endDate).format("YYYY-MM-DD"),
  ];

  return intervalDate;
};

const main = async (mode) => {
  try {
    let intervalDate;
    let fiscalNotes = [];
    let nfeFiscalNotesXmlTotal = [];
    let nfseFiscalNotesXmlTotal = [];
    let cteFiscalNotesXmlTotal = [];

    const startDate = new Date();
    console.log("Iniciando importação de Notas Fiscais");

    if (mode === "normal") {
      intervalDate = await importerQuestions();
    } else {
      intervalDate = [
        moment().subtract(1, "day").format("YYYY-MM-DD"),
        moment().subtract(1, "day").format("YYYY-MM-DD"),
      ];
    }

    console.log(
      `Importando xmls SIEG de ${intervalDate[0]} até ${intervalDate[1]}`
    );
    nfImportSpinner.start();

    const licenseData = await auth.getLicenseData();
    const cnpjs = licenseData.cnpj.split(".");

    // NFE
    await Promise.all(
      _.map(cnpjs, async (cnpj) => {
        console.log(`NFE - Baixando notas do CNPJ: ${cnpj}`);
        const nfeFiscalNotesXml = await importerXmls(cnpj, intervalDate, "nfe");
        fiscalNotes = [...fiscalNotes, ...nfeFiscalNotesXml];
        nfeFiscalNotesXmlTotal = [
          ...nfeFiscalNotesXmlTotal,
          ...nfeFiscalNotesXml,
        ];
      })
    );

    // NFSE
    await Promise.all(
      _.map(cnpjs, async (cnpj) => {
        console.log(`NFSE - Baixando notas do CNPJ: ${cnpj}`);
        const nfseFiscalNotesXml = await importerXmls(
          cnpj,
          intervalDate,
          "nfse"
        );
        fiscalNotes = [...fiscalNotes, ...nfseFiscalNotesXml];
        nfseFiscalNotesXmlTotal = [
          ...nfseFiscalNotesXmlTotal,
          ...nfseFiscalNotesXml,
        ];
      })
    );

    // CTE
    await Promise.all(
      _.map(cnpjs, async (cnpj) => {
        console.log(`CTE - Baixando notas do CNPJ: ${cnpj}`);
        const cteFiscalNotesXml = await importerXmls(cnpj, intervalDate, "cte");
        fiscalNotes = [...fiscalNotes, ...cteFiscalNotesXml];
        cteFiscalNotesXmlTotal = [
          ...cteFiscalNotesXmlTotal,
          ...cteFiscalNotesXml,
        ];
      })
    );

    nfImportSpinner.stop();
    console.log(
      "----------------------------------------------------------------\n"
    );
    console.log("Importação de Notas Fiscais concluída");
    console.log(`Total de notas: ${fiscalNotes.length}`);
    console.log(
      ` NFE(${nfeFiscalNotesXmlTotal.length})  - NFSE(${nfseFiscalNotesXmlTotal.length})  - CTE(${cteFiscalNotesXmlTotal.length})`
    );
    console.log(
      `Duração: ${
        dateFns.differenceInDays(new Date(), startDate)
          ? `${dateFns.differenceInDays(new Date(), startDate)} dias`
          : dateFns.differenceInHours(new Date(), startDate)
          ? `${dateFns.differenceInHours(new Date(), startDate)} horas`
          : dateFns.differenceInMinutes(new Date(), startDate)
          ? `${dateFns.differenceInMinutes(new Date(), startDate)} minutos`
          : dateFns.differenceInSeconds(new Date(), startDate)
          ? `${dateFns.differenceInSeconds(new Date(), startDate)} segundos`
          : dateFns.differenceInMilliseconds(new Date(), startDate)
          ? `${dateFns.differenceInMilliseconds(
              new Date(),
              startDate
            )} milissegundos`
          : ""
      }`
    );
    
  } catch (err) {
    logger.error(err);
    nfImportSpinner.stop();
    await error.errorImporterModule();
  }
};
const mainNormal = async (di,df) => {
   try {
    var intervalDate = [moment(di).format("YYYY-MM-DD"),
    moment(df).format("YYYY-MM-DD"),];
    let fiscalNotes = [];
    let nfeFiscalNotesXmlTotal = [];
    let nfseFiscalNotesXmlTotal = [];
    let cteFiscalNotesXmlTotal = [];

    const startDate = new Date();
    console.log("Iniciando importação de Notas Fiscais");

    // if (mode === "normal") {
    //   intervalDate = await importerQuestions();
    // } else {
    //   intervalDate = [
    //     moment().subtract(1, "day").format("YYYY-MM-DD"),
    //     moment().subtract(1, "day").format("YYYY-MM-DD"),
    //   ];
    // }

    console.log(
      `Importando xmls SIEG de ${intervalDate[0]} até ${intervalDate[1]}`
    );
    nfImportSpinner.start();

    const licenseData = await auth.getLicenseData();
    const cnpjs = licenseData.cnpj.split(".");

    // NFE
    await Promise.all(
      _.map(cnpjs, async (cnpj) => {
        console.log(`NFE - Baixando notas do CNPJ: ${cnpj}`);
        const nfeFiscalNotesXml = await importerXmls(cnpj, intervalDate, "nfe");
        fiscalNotes = [...fiscalNotes, ...nfeFiscalNotesXml];
        nfeFiscalNotesXmlTotal = [
          ...nfeFiscalNotesXmlTotal,
          ...nfeFiscalNotesXml,
        ];
      })
    );

    // NFSE
    await Promise.all(
      _.map(cnpjs, async (cnpj) => {
        console.log(`NFSE - Baixando notas do CNPJ: ${cnpj}`);
        const nfseFiscalNotesXml = await importerXmls(
          cnpj,
          intervalDate,
          "nfse"
        );
        fiscalNotes = [...fiscalNotes, ...nfseFiscalNotesXml];
        nfseFiscalNotesXmlTotal = [
          ...nfseFiscalNotesXmlTotal,
          ...nfseFiscalNotesXml,
        ];
      })
    );

    // CTE
    await Promise.all(
      _.map(cnpjs, async (cnpj) => {
        console.log(`CTE - Baixando notas do CNPJ: ${cnpj}`);
        const cteFiscalNotesXml = await importerXmls(cnpj, intervalDate, "cte");
        fiscalNotes = [...fiscalNotes, ...cteFiscalNotesXml];
        cteFiscalNotesXmlTotal = [
          ...cteFiscalNotesXmlTotal,
          ...cteFiscalNotesXml,
        ];
      })
    );

    nfImportSpinner.stop();
    console.log(
      "----------------------------------------------------------------\n"
    );
    console.log("Importação de Notas Fiscais concluída");
    console.log(`Total de notas: ${fiscalNotes.length}`);
    console.log(
      ` NFE(${nfeFiscalNotesXmlTotal.length})  - NFSE(${nfseFiscalNotesXmlTotal.length})  - CTE(${cteFiscalNotesXmlTotal.length})`
    );
    console.log(
      `Duração: ${
        dateFns.differenceInDays(new Date(), startDate)
          ? `${dateFns.differenceInDays(new Date(), startDate)} dias`
          : dateFns.differenceInHours(new Date(), startDate)
          ? `${dateFns.differenceInHours(new Date(), startDate)} horas`
          : dateFns.differenceInMinutes(new Date(), startDate)
          ? `${dateFns.differenceInMinutes(new Date(), startDate)} minutos`
          : dateFns.differenceInSeconds(new Date(), startDate)
          ? `${dateFns.differenceInSeconds(new Date(), startDate)} segundos`
          : dateFns.differenceInMilliseconds(new Date(), startDate)
          ? `${dateFns.differenceInMilliseconds(
              new Date(),
              startDate
            )} milissegundos`
          : ""
      }`
    );
  } catch (err) {
    logger.error(err);
    nfImportSpinner.stop();
    await error.errorImporterModule();
  }
};

module.exports = {
  main,mainNormal,
};
