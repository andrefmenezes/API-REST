const _ = require("lodash");
const functions = require("../../../../helpers/functions");

function getIdeTag(nf) {
  return !_.isUndefined(nf.ide) ? nf.ide[0] : false;
}

function getNf(xml) {
  return !_.isUndefined(xml.infCte) && xml.infCte.length > 0
    ? xml.infCte[0]
    : null;
}

function getNumberNf(nf) {
  const ide = getIdeTag(nf);

  return ide && !_.isUndefined(ide.nCT) //verificar se é nCT
    ? ide.nCT[0]
    : "";
}

function getSerie(nf) {
  const ide = getIdeTag(nf);

  return ide && !_.isUndefined(ide.serie) ? ide.serie[0] : "";
}

function getTpCTe(nf) {
  const ide = getIdeTag(nf);
  return ide && !_.isUndefined(ide.tpCTe) ? ide.tpCTe[0] : "";
}

async function getProviderRegisterNumber(nf) {
  const emit = !_.isUndefined(nf.emit) ? nf.emit[0] : false;

  const cpfCnpj =
    emit && !_.isUndefined(emit.CNPJ)
      ? emit.CNPJ[0]
      : !_.isUndefined(emit.CPF)
      ? emit.CPF[0]
      : "";

  return await functions.onlyNumber(cpfCnpj);
}

async function getIssueDate(nf) {
  const ide = getIdeTag(nf);
  const dhEmi = ide && !_.isUndefined(ide.dhEmi) ? ide.dhEmi[0] : "";

  return await functions.xmlFormatDate(dhEmi);
}

function getTotalValue(nf) {
  const valores = !_.isUndefined(nf.vPrest) ? nf.vPrest[0] : false;
  return valores && !_.isUndefined(valores.vTPrest) ? valores.vTPrest[0] : "";
}

function getChCte(xml) {
  const cteProc = !_.isUndefined(xml.cteProc) ? xml.cteProc : false;
  const protCTe =
    cteProc && !_.isUndefined(cteProc.protCTe) ? cteProc.protCTe[0] : false;
  const infProt =
    protCTe && !_.isUndefined(protCTe.infProt) ? protCTe.infProt[0] : false;
  return infProt && !_.isUndefined(infProt.chCTe) ? infProt.chCTe[0] : "";
}

async function makeJson(taker, xml) {
  let jsonCte = {};

  try {
    const nf = getNf(xml.cteProc.CTe[0]);
    if (!nf) return { error: "make json cte-v3" };

    const numberNf = getNumberNf(nf);

    jsonCte = {
      SF1: {
        F1_DOC: numberNf, // NUMERO DA NOTA
        F1_SERIE: getSerie(nf),
        F1_FILIAL: taker, // CNPJ/CPF TOMADOR
        A2_CGC: await getProviderRegisterNumber(nf), // CNPJ/CPF PRESTADOR
        F1_COND: "", // filled on backend
        F1_EMISSAO: await getIssueDate(nf), // DATA DE EMISSAO
        F1_TIPO: "C",//getTpCTe(nf),
        F1_FORMUL: "", // filled on backend
        F1_ESPECIE: "CTE",
        F1_IPI: "0", // filled only product nf
        F1_PESOL: "0", // filled only product nf
        F1_CHVNFE: await getChCte(xml),
        TABELA: "SF1",
        OPERACAO: "I",
        ARQUIVO: `${numberNf}.xml`,
      },
      SD1: [],
    };

    jsonCte.SD1.push({
      D1_COD: "", // filled on backend
      D1_UM: "", // filled on backend
      D1_DESC: "", // filled on backend
      D1_VUNIT: getTotalValue(nf),
      D1_TOTAL: getTotalValue(nf),
      D1_TES: "", // filled on backend
      D1_CF: "", // filled on backend
      D1_ALIQSOL: "", // filled on backend
      D1_IPI: "", // filled only product nf
      D1_LOCAL: "", // filled on backend
      D1_CLASFIS: "", // filled on backend
      D1_RATEIO: "", // filled on backend
      D1_CNO: "", // filled on backend
      D1_QUANT: "1",
    });

    return jsonCte;
  } catch (error) {
    return { error: "make json cte-v3" };
  }
}

module.exports = {
  makeJson,
};
