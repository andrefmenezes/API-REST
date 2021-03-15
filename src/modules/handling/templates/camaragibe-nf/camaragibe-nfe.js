const nfeV4 = require('../nfe/nfe-v4');
const global = require('../../config/global');

async function makeJson(file) {
  // console.log(`Camaragibe - Preparando JSON`);
  return await nfeV4.makeJson(global.cities.CAMARAGIBE, file);
}

module.exports = {
  makeJson
};
