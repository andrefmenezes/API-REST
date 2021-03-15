const _ = require('lodash');
const functions = require('../../../../helpers/functions');

async function getNf(xml) {
  const compNfse = (!_.isUndefined(xml.CompNfse))
    ? xml.CompNfse[0] : false;

  return await ((compNfse) && (!_.isUndefined(compNfse.Nfse)))
    ? compNfse.Nfse[0] : '';
}

async function getNumberNf(nf) {
  const InfNfse = (!_.isUndefined(nf.InfNfse))
    ? nf.InfNfse[0] : false;

  return await ((InfNfse) && (!_.isUndefined(InfNfse.Numero)))
    ? InfNfse.Numero[0] : '';
}

async function getSerie(nf) {
  return '';
}

async function getProviderRegisterNumber(nf) {
  const InfNfse = (!_.isUndefined(nf.InfNfse))
    ? nf.InfNfse[0] : false;

  const IdentificacaoPrestador = ((InfNfse) && (!_.isUndefined(InfNfse.PrestadorServico[0].IdentificacaoPrestador[0].Cnpj)))
    ? InfNfse.PrestadorServico[0].IdentificacaoPrestador[0].Cnpj[0]
    : InfNfse.PrestadorServico[0].IdentificacaoPrestador[0].Cpf[0]

  return await functions.onlyNumber(IdentificacaoPrestador);
}

async function getIssueDate(nf) {
  const InfNfse = (!_.isUndefined(nf.InfNfse))
    ? nf.InfNfse[0] : false;

  const dataEmissao = ((InfNfse) && (!_.isUndefined(InfNfse.DataEmissao)))
    ? InfNfse.DataEmissao[0]
    : '';

  return await functions.xmlFormatDate(dataEmissao);
}

async function getService(nf) {
  const InfNfse = (!_.isUndefined(nf.InfNfse))
    ? nf.InfNfse[0] : false;

  return await ((InfNfse) && (!_.isUndefined(InfNfse.Servico)))
    ? InfNfse.Servico[0] : false;
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
      .replace(/ns2:/g, '')
      .replace(/ns3:/g, '')
      .replace(/ns4:/g, '')
      .replace(/ns5:/g, '')
  ).ConsultarNfseResposta.ListaNfse[0];

  const nf = await getNf(xml);
  const numberNf = await getNumberNf(nf);

  if (!nf) return { error: `make json nfse-ginfes-V3.0 city - ${city}` };

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
      )
    }

    return jsonNfe;
  } catch (error) {
    return { error: `make json nfse-ginfes-V3.0 city - ${city}` };
  }
}

module.exports = {
  makeJson,
};
