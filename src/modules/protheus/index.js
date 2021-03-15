const axios = require("axios");
const _ = require("lodash");
const global = require("../../config/global");
const logger = require("../../config/logger");
const auth = require("../../modules/auth");

const importerNfs = async (licenseData, nfs) => {
  try {
    let sendNfe = "";
    return Promise.resolve(
      (sendNfe = await axios.default.post(
        licenseData.protheusImporterApi,
        nfs,
        {
          timeout: global.timeout.timeoutImporter,
          headers: {
            Authorization: `BASIC ${licenseData.protheusUser}`,
          },
        }
      ))
    )
      .then(() => {
        if (sendNfe.status == "201" || sendNfe.status == "200") {
          console.log(" Importado com sucesso");
          return true;
        } else {
          logger.error(sendNfe);
          console.log(" Ocorreu um erro ao importar as notas");
          return false;
        }
      })
      .catch((err) => {
        console.log(
          "Ocorreu um erro ao importar as notas ou não existem notas a serem importadas"
        );
      });
  } catch (err) {
    logger.error(err);
    console.log(
      "Ocorreu um erro ao importar as notas para o protheus (falha de comunicação)"
    );
  }
};

const main = async (nfs) => {
  try {
    const licenseData = await auth.getLicenseData();
    console.log("Iniciando importação de Notas Fiscais para o Protheus");

    if (nfs.nfe.length) {
      console.log("Importando NFE");
      await importerNfs(licenseData, nfs.nfe);
    }
    if (nfs.nfse.length) {
      console.log("Importando NFSE");
      await importerNfs(licenseData, nfs.nfse);
    }
    if (nfs.cte.length) {
      console.log("Importando CTE");
      await importerNfs(licenseData, nfs.cte);
    }
  } catch (err) {
    logger.error(err);
    console.log(
      "Ocorreu um erro ao importar as NFS para o protheus (falha de comunicação)"
    );
  }
};

module.exports = { main, importerNfs };
