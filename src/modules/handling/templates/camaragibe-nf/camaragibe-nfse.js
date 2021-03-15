const nfseAbrasf = require('../../patterns/nfse/nfse-abrasf');
const global = require('../../../../config/global');

async function makeJson(event) {
  // console.log(`Camaragibe - Preparando JSON`);
  return await nfseAbrasf.makeJson(global.cities.CAMARAGIBE, event);
}

module.exports = {
  makeJson
};
