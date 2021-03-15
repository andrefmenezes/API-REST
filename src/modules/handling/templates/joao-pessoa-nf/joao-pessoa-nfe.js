const nfeV4 = require('../nfe/nfe-v4');
const global = require('../../../../config/global');

async function makeJson(file) {
  // console.log(`João Pessoa - Preparando JSON`);
  return await nfeV4.makeJson(global.cities.JOAO_PESSOA, file);
}

module.exports = {
  makeJson
};
