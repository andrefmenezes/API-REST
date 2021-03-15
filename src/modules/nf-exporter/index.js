const _ = require("lodash");
const fs = require("fs");
const structure = require("../structure");
const eventModel = require("../../database/models/event");
const dirs = structure.dir;

const main = async (events) => {
  try {
    console.log("Salvando XML");

    let stopLoop = false;
    let path;

    if (events.length > 0) {
      const promise = events.map(async (event) => {
        if (event.type === "nfe") {
          path = dirs.nfeWritePath;
        } else if (event.type === "nfse") {
          path = dirs.nfseWritePath;
        } else if (event.type === "cte") {
          path = dirs.cteWritePath;
        }

        const xmlData = Buffer.from(event.blob, "base64").toString("utf8");
        const date = `${event.nfDate}`;
        const year = date.substr(0, 4);
        const month = date.substr(4, 2);

        if (!fs.existsSync(`${path}/${event.cnpj}`))
          fs.mkdirSync(`${path}/${event.cnpj}`);
        if (!fs.existsSync(`${path}/${event.cnpj}/${year}`))
          fs.mkdirSync(`${path}/${event.cnpj}/${year}`);
        if (!fs.existsSync(`${path}/${event.cnpj}/${year}/${month}`))
          fs.mkdirSync(`${path}/${event.cnpj}/${year}/${month}`);

        fs.writeFileSync(
          `${path}/${event.cnpj}/${year}/${month}/${event.nfNumber}.xml`,
          xmlData,
          { encoding: "utf8" }
        );
      });

      await Promise.all(promise);
    }

    console.log("XML salvo com sucesso");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { main };
