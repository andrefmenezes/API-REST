const nfeV4 = require('../../patterns/nfe/nfe-v4');
const global = require('../../../../config/global');

async function makeJson(file) {
  return await nfeV4.makeJson(global.cities.ABREU_E_LIMA, file);
}

module.exports = {
  abreuELimaNfe: {
    makeJson
  }
};