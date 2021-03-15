const _ = require('lodash');
const functions = require('../../../../helpers/functions');

async function getNf(xml) {
  return await (!_.isUndefined(xml.InfNfse))
    ? xml.InfNfse[0] : false
}

async function getNumberNf(nf) {
  return await (!_.isUndefined(nf.Numero))
    ? nf.Numero[0]
    : '';
}

async function getSerie(nf) {
  return '';
}

async function getProviderRegisterNumber(nf) {
  return await functions.onlyNumber(
    (!_.isUndefined(nf.PrestadorServico[0].IdentificacaoPrestador[0].CpfCnpj[0].Cnpj))
      ? nf.PrestadorServico[0].IdentificacaoPrestador[0].CpfCnpj[0].Cnpj[0]
      : nf.PrestadorServico[0].IdentificacaoPrestador[0].CpfCnpj[0].Cpf[0]
  );
}

async function getIssueDate(nf) {
  const dataEmissao = (!_.isUndefined(nf.DataEmissao))
    ? nf.DataEmissao[0]
    : '';

  return await functions.xmlFormatDate(dataEmissao);
}

async function getService(nf) {
  const declaracaoServico = (!_.isUndefined(nf.DeclaracaoPrestacaoServico))
    ? nf.DeclaracaoPrestacaoServico[0] : false;
  const infServico = ((declaracaoServico) && (!_.isUndefined(declaracaoServico.InfDeclaracaoPrestacaoServico)))
    ? declaracaoServico.InfDeclaracaoPrestacaoServico[0] : false;
  return await ((infServico) && (!_.isUndefined(infServico.Servico)))
    ? infServico.Servico[0] : false;
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

async function getAliquot(nf) {
  const valoresNfse = (!_.isUndefined(nf.ValoresNfse))
    ? nf.ValoresNfse[0] : false;
  return await ((valoresNfse) && (!_.isUndefined(valoresNfse.Aliquota)))
    ? valoresNfse.Aliquota[0] : '';
}

async function getCnaeCode(servico) {
  return await (!_.isUndefined(servico.CodigoCnae)) ? servico.CodigoCnae[0] : '';
}

async function makeJson(city, event) {
  let jsonNfe = {};
  const xml = event.xml.CompNfse.Nfse[0];

  const nf = await getNf(xml);
  const numberNf = await getNumberNf(nf);

  if (!nf) return { error: `make json nfse-abrasf-v2.02 city - ${city}` };

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
          D1_ALIQSOL: await getAliquot(nf),
          D1_IPI: '',// filled only product nf
          D1_LOCAL: '',// filled on backend
          D1_CLASFIS: await getCnaeCode(servico),
          D1_RATEIO: '',// filled on backend
          D1_CNO: '',// filled on backend
          D1_QUANT: '1'
        }
      )
    };

  } catch (error) {
    return { error: `make json nfse-abrasf-v2.02 city - ${city}` };
  }
}

module.exports = {
  makeJson,
}
