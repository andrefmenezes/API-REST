const nfeV4 = require('../nfe/nfe-v4');
const global = require('../../config/global');

async function makeJson(file) {
  // console.log(`Caruaru - Preparando JSON`);
  return await nfeV4.makeJson(global.cities.CARUARU, file);
}

module.exports = {
  makeJson
};
