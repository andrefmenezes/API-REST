const nfseAbrasf = require('../../patterns/nfse/nfse-abrasf-v2.02');
const global = require('../../../../config/global');

async function makeJson(event) {
  // console.log(`Campina Grande - Preparando JSON`);
  return await nfseAbrasf.makeJson(global.cities.CAMPINA_GRANDE, event);
}

module.exports = {
  makeJson
};
