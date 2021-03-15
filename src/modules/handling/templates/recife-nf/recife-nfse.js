const nfseAbrasf = require('../../patterns/nfse/nfse-abrasf');
const global = require('../../../../config/global');

async function makeJson(event) {
  return await nfseAbrasf.makeJson(global.cities.RECIFE, event);
}

module.exports = {
  recifeNfse: {
    makeJson
  }
};
