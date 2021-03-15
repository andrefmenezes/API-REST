const nfseGinfes = require('../../patterns/nfse/nfse-ginfes-v1.0');
const global = require('../../../../config/global');

async function makeJson(event) {
  // console.log(`Caruaru - Preparando JSON`);
  return await nfseGinfes.makeJson(global.cities.CARUARU, event);
}

module.exports = {
  makeJson
};
