const fs = require("fs");
const logger = require("../../config/logger");
const error = require("../error");

const dir = {
  nfSavePaste: process.cwd() + "/NFESIEG",
  nfXmlPaste: process.cwd() + "/NFESIEG/XML",
  nfeWritePath: process.cwd() + "/NFESIEG/XML/NFE",
  nfseWritePath: process.cwd() + "/NFESIEG/XML/NFSE",
  cteWritePath: process.cwd() + "/NFESIEG/XML/CTE",
  licenseFile: process.cwd() + "/license.key",
  // nfSavePaste:"C:/Users/p3tec/OneDrive/Área de Trabalho/NFESIEG",
  // nfXmlPaste: "C:/Users/p3tec/OneDrive/Área de Trabalho/NFESIEG/XML",
  // nfeWritePath:"C:/Users/p3tec/OneDrive/Área de Trabalho/NFESIEG/XML/NFE",
  // nfseWritePath:"C:/Users/p3tec/OneDrive/Área de Trabalho/NFESIEG/XML/NFSE",
  // cteWritePath: "C:/Users/p3tec/OneDrive/Área de Trabalho/NFESIEG/XML/CTE",
  // licenseFile: process.cwd() + "/license.key",
};

const main = async () => {
  try {
    console.log("Criando estrutura de pastas");
    makeStructure();
  } catch (err) {
    logger.error(err);
    await error.noMountingStructure();
  }
};

const makeStructure = async () => {
  if (!fs.existsSync(dir.nfSavePaste)) fs.mkdirSync(dir.nfSavePaste);
  if (!fs.existsSync(dir.nfXmlPaste)) fs.mkdirSync(dir.nfXmlPaste);
  if (!fs.existsSync(dir.nfeWritePath)) fs.mkdirSync(dir.nfeWritePath);
  if (!fs.existsSync(dir.nfseWritePath)) fs.mkdirSync(dir.nfseWritePath);
  if (!fs.existsSync(dir.cteWritePath)) fs.mkdirSync(dir.cteWritePath);
};

module.exports = { main, dir };
