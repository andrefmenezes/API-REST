const nfseAbrasf = require('../../patterns/nfse/nfse-abrasf-v2.02-pb');
const global = require('../../../../config/global');

async function makeJson(event) {
  // console.log(`João Pessoa - Preparando JSON`);
  return await nfseAbrasf.makeJson(global.cities.JOAO_PESSOA, event);
}

module.exports = {
  makeJson
};
