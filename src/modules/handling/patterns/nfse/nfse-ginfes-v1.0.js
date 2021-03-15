const _ = require('lodash');
const functions = require('../../../../helpers/functions');

async function getNf(xml) {
  return await xml;
}
async function getNumberNf(nf) {
  const identificacaoNfse = (!_.isUndefined(nf.IdentificacaoNfse))
    ? nf.IdentificacaoNfse[0] : false;
  return await ((identificacaoNfse) && (!_.isUndefined(identificacaoNfse.Numero)))
    ? identificacaoNfse.Numero[0] : '';
}

async function getSerie(nf) {
  return '';
}

async function getProviderRegisterNumber(nf) {
  return await functions.onlyNumber(
    (!_.isUndefined(nf.PrestadorServico[0].IdentificacaoPrestador[0].Cnpj))
      ? nf.PrestadorServico[0].IdentificacaoPrestador[0].Cnpj[0]
      : nf.PrestadorServico[0].IdentificacaoPrestador[0].Cpf[0]
  );
}
async function getIssueDate(nf) {
  const dataEmissao = (!_.isUndefined(nf.DataEmissao))
    ? nf.DataEmissao[0]
    : '';

  return await functions.xmlFormatDate(dataEmissao);
}

async function getService(nf) {
  return await (!_.isUndefined(nf.Servico))
    ? nf.Servico[0] : false;
}

async function getUnityValue(servico) {
  const valores = (!_.isUndefined(servico.Valores))
    ? servico.Valores[0] : false;
  return await ((valores) && (!_.isUndefined(valores.ValorServicos)))
    ? valores.ValorServicos[0] : '';
}

async function getTotalValue(servico) {
  const valores = (!_.isUndefined(servico.Valores))
    ? servico.Valores[0] : false;
  return await ((valores) && (!_.isUndefined(valores.ValorServicos)))
    ? valores.ValorServicos[0] : '';
}

async function getAliquot(servico) {
  const valores = (!_.isUndefined(servico.Valores))
    ? servico.Valores[0] : false;
  return await ((valores) && (!_.isUndefined(valores.Aliquota)))
    ? valores.Aliquota[0] : '';
}

async function getCnaeCode(servico) {
  return await (!_.isUndefined(servico.CodigoTributacaoMunicipio))
    ? servico.CodigoTributacaoMunicipio[0] : '';
}

async function makeJson(city, event) {
  let jsonNfe = {};

  const xml = JSON.parse(
    JSON.stringify(event.xml)
      .replace(/ns2:Nfse/g, 'Nfse2')
      .replace(/ns3:/g, '')
    ).NFSE.Nfse[0];

  const nf = await getNf(xml);
  const numberNf = await getNumberNf(nf);

  if (!nf) return { error: `make json nfse-ginfes-V1.0 city - ${city}` };

  try {
    jsonNfe = {
      SF1: {
        F1_DOC: numberNf, // NUMERO DA NOTA
        F1_SERIE: await getSerie(nf),
        F1_FILIAL: event.cnpj, // CNPJ/CPF TOMADOR
        A2_CGC: await getProviderRegisterNumber(nf), // CNPJ/CPF PRESTADOR
        F1_COND: '',// filled on backend
        F1_EMISSAO: await getIssueDate(nf), // DATA DE EMISSAO
        F1_TIPO: 'N',
        F1_FORMUL: '',// filled on backend
        F1_ESPECIE: 'NFS',
        F1_IPI: '0',// filled only product nf
        F1_PESOL: '0',// filled only product nf
        F1_CHVNFE: '',
        TABELA: 'SF1',
        OPERACAO: 'I',
        ARQUIVO: `${numberNf}.xml`,
      },
      SD1: [],
    };

    const servico = await getService(nf);

    if (servico) {
      jsonNfe.SD1.push(
        {
          D1_COD: '', // filled on backend
          D1_UM: '', // filled on backend
          D1_DESC:'', // filled on backend
          D1_VUNIT: await getUnityValue(servico),
          D1_TOTAL: await getTotalValue(servico),
          D1_TES: '',// filled on backend
          D1_CF: '',// filled on backend
          D1_ALIQSOL: await getAliquot(servico),
          D1_IPI: '',// filled only product nf
          D1_LOCAL: '',// filled on backend
          D1_CLASFIS: await getCnaeCode(servico),
          D1_RATEIO: '',// filled on backend
          D1_CNO: '',// filled on backend
          D1_QUANT: '1'
        }
      );
    };

    return jsonNfe;
  } catch (error) {
    return { error: `make json nfse-ginfes-V1.0 city - ${city}` };
  }
}

module.exports = {
  makeJson,
};
