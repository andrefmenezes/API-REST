const nfseGinfes = require('../../patterns/nfse/nfse-ginfes-v3.0');
const global = require('../../../../config/global');

async function makeJson(event) {
  return await nfseGinfes.makeJson(global.cities.FORTALEZA, event);
}

module.exports = {
  fortalezaNfse: {
    makeJson
  }
};
