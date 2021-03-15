const fs = require("fs");
const jwt = require("jsonwebtoken");
const macaddress = require("macaddress");
const error = require("../error");
const structure = require("../structure");

const dirs = structure.dir;

const authKey = "Qm9seiBoeXBFcnggLyopKMO8IEJyI2dodA==";

const checkLicenseFile = async () => {
  let address;

  macaddress.one(function (err, mac) {
    address = mac;
  });

  console.log("Checando arquivo de licença");
  if (!fs.existsSync(dirs.licenseFile)) await error.noLicenseFile();

  console.log("Checando dados do emissor da licença");
  const token = await getLicenseToken();

  const emitter = jwt.verify(token, authKey);
  if (!emitter) await error.licenseEmitError();

  const licenseData = await getLicenseData();

  if (licenseData.onlythispc === true && licenseData.mac != address) {
    await error.computerNotAuthorized();
  }
};

const getLicenseToken = async () => {
  const token = fs
    .readFileSync(dirs.licenseFile, { encoding: "utf8" })
    .toString();
  return token;
};

const getLicenseData = async () => {
  const token = fs
    .readFileSync(dirs.licenseFile, { encoding: "utf8" })
    .toString();
  const data = jwt.decode(token);
  return data;
};

module.exports = { checkLicenseFile, getLicenseToken, getLicenseData };
