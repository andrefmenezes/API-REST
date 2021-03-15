const nfseAbrasf = require('../../patterns/nfse/nfse-abrasf-v2.02');
const global = require('../../../../config/global');

async function makeJson(event) {
  return await nfseAbrasf.makeJson(global.cities.SERGIPE, event);
}

module.exports = {
  sergipeNfse: {
    makeJson
  }
};
