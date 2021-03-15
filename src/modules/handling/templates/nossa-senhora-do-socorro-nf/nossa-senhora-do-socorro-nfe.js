const nfeV4 = require('../../patterns/nfe/nfe-v4');
const global = require('../../../../config/global');

async function makeJson(file) {
  return await nfeV4.makeJson(global.cities.NOSSA_SENHORA_DO_SOCORRO, file);
}

module.exports = {
  nossaSenhoraDoSocorroNfe: {
    makeJson
  }
};
