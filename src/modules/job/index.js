const { CronJob } = require("cron");
const moment = require("moment");
const importer = require("../nf-importer");
const handling = require("../handling/handling");
const protheus = require("../protheus");
const exporter = require("../nf-exporter");
const structure = require("../structure/");
const log = require("../log");
const error = require("../error");

const nfImporterJob = async () => {
  const job = new CronJob("05 00 00 * * 1-7", async () => {
    console.log(
      "\n----------------------------------------------------------------"
    );
    console.log("Iniciando importação automática de notas fiscais (D-1)");
    console.log("Data:", moment().format("DD/MM/YYYY HH:mm:ss"));
    await structure.main();
    await importer.main("job");
    console.log(
      "----------------------------------------------------------------\n"
    );
  });
  job.start();
  return true;
};

const main = async () => {
  try {
    await nfImporterJob();
  } catch (err) {
    await error.errorJobMode();
  }
};

module.exports = { main };
