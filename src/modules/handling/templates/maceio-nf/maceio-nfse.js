const nfseGinfes = require('../../patterns/nfse/nfse-ginfes');
const global = require('../../../../config/global');

async function makeJson(event) {
  return await nfseGinfes.makeJson(global.cities.MACEIO, event);
}

module.exports = {
  maceioNfse: {
    makeJson
  }
};
