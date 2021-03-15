const _ = require('lodash');
const nfeV4 = require('./patterns/nfe/nfe-v4');

async function findCityCode(result) {
  try {
    //console.log(result.nfeProc.NFe[0].infNFe[0].ide[0].cMunFG[0])
    return result.nfeProc.NFe[0].infNFe[0].ide[0].cMunFG[0];
  } catch(error) {
    return false;
  }
}

async function makeJson(event) {
  let city;
//console.log(event.xml)
  try {
    city = await findCityCode(event.xml);
    //console.log("TESTE",event.xml)
    if (city === false || city === null || city === undefined) return { error: 'layout' };

    const processFile = await nfeV4.makeJson(event.cnpj, event.xml);
   
    return processFile;
  } catch (error) {
    return { error: 'layout' };
  }
}

module.exports = {
  makeJson,
};
