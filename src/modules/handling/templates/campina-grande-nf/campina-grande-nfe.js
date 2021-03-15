const nfeV4 = require('../nfe/nfe-v4');
const global = require('../../config/global');

async function makeJson(file) {
  // console.log(`Campina Grande - Preparando JSON`);
  return await nfeV4.makeJson(global.cities.CAMPINA_GRANDE, file);
}

module.exports = {
  makeJson
};
