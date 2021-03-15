const nfeV4 = require('../../patterns/nfe/nfe-v4');
const global = require('../../../../config/global');

async function makeJson(file) {
  return await nfeV4.makeJson(global.cities.RIO_DE_JANEIRO, file);
}

module.exports = {
  rioDeJaneiroNfe: {
    makeJson
  }
};
