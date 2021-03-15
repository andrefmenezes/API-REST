const nfseAbrasf = require('../../patterns/nfse/nfse-abrasf');
const global = require('../../../../config/global');

async function makeJson(event) {
  return await nfseAbrasf.makeJson(global.cities.JABOATAO, event);
}

module.exports = {
  jaboataoNfse: {
    makeJson
  }
};
