const _ = require('lodash');
const functions = require('../../../../helpers/functions');

async function getNf(xml) {
  return await ((!_.isUndefined(xml.infNFe)) && (xml.infNFe.length > 0)) ? xml.infNFe[0] : null
}

async function getNumberNf(nf) {
  const ide = await (!_.isUndefined(nf.ide))
    ? nf.ide[0]
    : false;

  return await ((ide) && (!_.isUndefined(ide.nNF)))
    ? ide.nNF[0]
    : '';
}

async function getSerie(nf) {
  const ide = await (!_.isUndefined(nf.ide))
    ? nf.ide[0]
    : false;

  return await ((ide) && (!_.isUndefined(ide.serie)))
    ? ide.serie[0]
    : '';
}

async function getFinNfe(nf) {
  const ide = await (!_.isUndefined(nf.ide))
    ? nf.ide[0]
    : false;

  const finNFe = await ((ide) && (!_.isUndefined(ide.finNFe)))
    ? ide.finNFe[0]
    : '';

  return await functions.getTypeFinNfe(finNFe);
}

async function getProviderRegisterNumber(nf) {
  const emit = await (!_.isUndefined(nf.emit))
    ? nf.emit[0]
    : false;

  const cpfCnpj = ((emit) && (!_.isUndefined(emit.CNPJ)))
    ? emit.CNPJ[0]
    : (!_.isUndefined(emit.CPF)) ? emit.CPF[0] : '';

  return await functions.onlyNumber(cpfCnpj);
}

async function getIssueDate(nf) {
  const ide = await (!_.isUndefined(nf.ide))
    ? nf.ide[0]
    : false;

  const dhEmi = await ((ide) && (!_.isUndefined(ide.dhEmi)))
    ? ide.dhEmi[0]
    : '';

  return await functions.xmlFormatDate(dhEmi);
}

async function getProduct(det) {
  return await ((!_.isUndefined(det.prod)) && (det.prod.length > 0)) ? det.prod[0] : null
}

async function getCodProduct(product) {
  return await ((product) && (!_.isUndefined(product.cProd)))
    ? product.cProd[0]
    : '';
}

async function getDescProduct(product){
  return await ((product) && (!_.isUndefined(product.xProd)))
    ? product.xProd[0]
    : '';
}

async function getUnity(product) {
  return await ((product) && (!_.isUndefined(product.uCom)))
    ? product.uCom[0]
    : '';
}

async function getUnityValue(product) {
  return await ((product) && (!_.isUndefined(product.vUnCom)))
    ? product.vUnCom[0]
    : '';
}

async function getTotalValue(product) {
  return await ((product) && (!_.isUndefined(product.vProd)))
    ? product.vProd[0]
    : '';
}

async function getTotalQuantity(product) {
  return await ((product) && (!_.isUndefined(product.qCom)))
    ? product.qCom[0]
    : '';
}

async function getIpiValue(det) {
  const imposto = ((!_.isUndefined(det.imposto)) && (det.imposto.length > 0)) ? det.imposto[0] : false;
  const ipi = ((imposto) && (!_.isUndefined(imposto.IPI))) ? imposto.IPI[0] : false;
  const ipiTrib = ((ipi) && (!_.isUndefined(ipi.IPITrib))) ? ipi.IPITrib[0] : false;
  return await ((ipiTrib) && (!_.isUndefined(ipiTrib.vIPI))) ? ipiTrib.vIPI[0] : '';
}

async function getChNFe(xml) {
  const nfeProc = (!_.isUndefined(xml.nfeProc)) ? xml.nfeProc : false;
  const protNFe = ((nfeProc) && (!_.isUndefined(nfeProc.protNFe))) ? nfeProc.protNFe[0] : false;
  const infProt = ((protNFe) && (!_.isUndefined(protNFe.infProt))) ? protNFe.infProt[0] : false;
  return await ((infProt) && (!_.isUndefined(infProt.chNFe))) ? infProt.chNFe[0] : '';
}

async function makeJson(taker, xml) {
  let jsonNfe = {};

  try {
    const nf = await getNf(xml.nfeProc.NFe[0]);

    if (!nf) return { error: 'make json nfe-v4' };

    const numberNf = await getNumberNf(nf);

    jsonNfe = {
      SF1: {
        F1_DOC: numberNf, // NUMERO DA NOTA
        F1_SERIE: await getSerie(nf),
        F1_FILIAL: taker, // CNPJ/CPF TOMADOR
        A2_CGC: await getProviderRegisterNumber(nf), // CNPJ/CPF PRESTADOR
        F1_COND: '',// filled on backend
        F1_EMISSAO: await getIssueDate(nf), // DATA DE EMISSAO
        F1_TIPO: await getFinNfe(nf),
        F1_FORMUL: '',// filled on backend
        F1_ESPECIE: 'NFE',
        F1_IPI: '0',// filled only product nf
        F1_PESOL: '0',// filled only product nf
        F1_CHVNFE: await getChNFe(xml),
        TABELA: 'SF1',
        OPERACAO: 'I',
        ARQUIVO: `${numberNf}.xml`,
      },
      SD1: []
    };

    await Promise.all(
      _.map(nf.det, async det => {
        const product = await getProduct(det);

        jsonNfe.SD1.push({
          D1_COD: await getCodProduct(product),
          D1_DESC: await getDescProduct(product),
          D1_UM: await getUnity(product),
          D1_VUNIT: await getUnityValue(product),
          D1_TOTAL: await getTotalValue(product),
          D1_TES: '',// filled on backend
          D1_CF: '',// filled on backend
          D1_ALIQSOL: '',// filled on backend
          D1_IPI: await getIpiValue(det),
          D1_LOCAL: '',// filled on backend
          D1_CLASFIS: '',// without value on xml
          D1_RATEIO: '',// filled on backend
          D1_CNO: '',// filled on backend
          D1_QUANT: await getTotalQuantity(product),
        })
      }),
    );
   console.log(jsonNfe)
    return jsonNfe;
  } catch (error) {
    return { error: 'make json nfe-v4' };
  }
}

module.exports = {
  makeJson,
};
