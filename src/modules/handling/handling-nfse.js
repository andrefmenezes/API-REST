const _ = require("lodash");
const template = require("./templates");
const global = require("../../config/global");

async function findCityCode(result) {
  //ABRASF/TINUS (SALVADOR / CAMARAGIBE / JABOATÃO / RECIFE)
  try {
    return result.ConsultarNfseResposta.ListaNfse[0].CompNfse[0].Nfse[0]
      .InfNfse[0].OrgaoGerador[0].CodigoMunicipio[0];
    // result.ConsultarNfseResposta.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0].PrestadorServico[0].Endereco[0].CodigoMunicipio[0];
  } catch (error) {}

  //MACEIO / CARUARU
  try {
    return JSON.parse(
      JSON.stringify(result)
        .replace(/ns2:/g, "")
        .replace(/ns3:/g, "")
        .replace(/ns4:/g, "")
        .replace(/ns5:/g, "")
    ).NFSE.Nfse[0].OrgaoGerador[0].CodigoMunicipio[0];
  } catch (error) {}

  //RECIFE - NFE
  try {
    return result.RetornoConsulta.NFe[0].EnderecoPrestador[0].Cidade[0];
  } catch (error) {}

  //SERGIPE / Campina Grande - NFSE
  try {
    return result.CompNfse.Nfse[0].InfNfse[0].OrgaoGerador[0]
      .CodigoMunicipio[0];
  } catch (error) {}

  //JOÃO PESSOA - NFSE
  try {
    return JSON.parse(JSON.stringify(result).replace(/nfse:/g, ""))
      .GerarNfseResposta.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0]
      .OrgaoGerador[0].CodigoMunicipio[0];
  } catch (error) {}

  //CEARÁ - NFSE
  try {
    return JSON.parse(JSON.stringify(result).replace(/ns2:/g, "")).NFSE.Nfse[0]
      .Nfse[0].OrgaoGerador[0].CodigoMunicipio[0];
  } catch (error) {}

  return false;
}

async function makeJson(event) {
  city = await findCityCode(event.xml);
  let json = "";

  if (city === false) return { error: "layout" };

  switch (city) {
    case global.cities.CAMPINA_GRANDE.IBGECode:
      if (global.cities.CAMPINA_GRANDE.active)
        json = await template.campinaGrandeNfse.makeJson(event);
      break;
    case global.cities.RECIFE.IBGECode:
      if (global.cities.RECIFE.active)
        json = await template.recifeNfse.makeJson(event);
      break;
    case global.cities.CARUARU.IBGECode:
      if (global.cities.CARUARU.active)
        json = await template.caruaruNfse.makeJson(event);
      break;
    case global.cities.FORTALEZA.IBGECode:
      if (global.cities.FORTALEZA.active)
        json = await template.fortalezaNfse.makeJson(event);
      break;
    case global.cities.JOAO_PESSOA.IBGECode:
      if (global.cities.JOAO_PESSOA.active)
        json = await template.joaoPessoaNfse.makeJson(event);
      break;
    case global.cities.SALVADOR.IBGECode:
      if (global.cities.SALVADOR.active)
        json = await template.salvadorNfse.makeJson(event);
      break;
    case global.cities.SERGIPE.IBGECode:
      if (global.cities.SERGIPE.active)
        json = await template.sergipeNfse.makeJson(event);
      break;
    case global.cities.MACEIO.IBGECode:
      if (global.cities.MACEIO.active)
        json = await template.maceioNfse.makeJson(event);
      break;
    case global.cities.JABOATAO.IBGECode:
      if (global.cities.JABOATAO.active)
        json = await template.jaboataoNfse.makeJson(event);
      break;
    case global.cities.CAMARAGIBE.IBGECode:
      if (global.cities.CAMARAGIBE.active)
        json = await template.camaragibeNfse.makeJson(event);
      break;
    default:
      json = { error: "city not registred" };
  }

  return json;
}

module.exports = {
  makeJson,
};
