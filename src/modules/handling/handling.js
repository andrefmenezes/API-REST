const _ = require("lodash");
const xml2js = require("xml2js");
const handlingNfse = require("./handling-nfse");
const handlingNfe = require("./handling-nfe");
const handlingCte = require("./handling-cte");
const eventModel = require("../../database/models/event");

const parser = new xml2js.Parser();

const processNfse = async () => {
  const jsonArr = [];
  let stopLoop = false;

  const nfseOpenEvents = await eventModel.lengthEventsOpen("nfse");

  if (nfseOpenEvents.events > 0) {
    while (stopLoop === false) {
      const event = await eventModel.getEventProcess("nfse");

      parser.parseString(
        Buffer.from(event.xml, "base64").toString("utf8"),
        async (err, result) => {
          event.xml = result;
        }
      );

      const json = await handlingNfse.makeJson(event);

      if (json.hasOwnProperty("error")) {
        await saveEventProcessError(event.id, json.error);
      } else {
        await eventModel.saveEventProcess(
          event.id,
          json.SF1.F1_DOC,
          json.SF1.F1_EMISSAO
        );
        jsonArr.push({ ...json });
      }

      const checkPendingEvents = await eventModel.lengthEventsOpen("nfse");
      checkPendingEvents.events > 0 ? (stopLoop = false) : (stopLoop = true);
    }
  }

  return jsonArr;
};

const processNfe = async () => {
  const jsonArr = [];
  let stopLoop = false;

  const nfeOpenEvents = await eventModel.lengthEventsOpen("nfe");

  if (nfeOpenEvents.events > 0) {
    while (stopLoop === false) {
      const event = await eventModel.getEventProcess("nfe");

      parser.parseString(
        Buffer.from(event.xml, "base64").toString("utf8"),
        async (err, result) => {
          event.xml = result;
        }
      );

      const json = await handlingNfe.makeJson(event);

      if (json.hasOwnProperty("error")) {
        await eventModel.saveEventProcessError(event.id, json.error);
      } else {
        await eventModel.saveEventProcess(
          event.id,
          json.SF1.F1_DOC,
          json.SF1.F1_EMISSAO
        );
        jsonArr.push({ ...json });
      }

      const checkPendingEvents = await eventModel.lengthEventsOpen("nfe");
      checkPendingEvents.events > 0 ? (stopLoop = false) : (stopLoop = true);
    }
  }

  return jsonArr;
};

const processCte = async () => {
  const jsonArr = [];
  let stopLoop = false;

  const cteOpenEvents = await eventModel.lengthEventsOpen("cte");

  if (cteOpenEvents.events > 0) {
    while (stopLoop === false) {
      const event = await eventModel.getEventProcess("cte");

      parser.parseString(
        Buffer.from(event.xml, "base64").toString("utf8"),
        async (err, result) => {
          event.xml = result;
        }
      );

      const json = await handlingCte.makeJson(event);

      if (json.hasOwnProperty("error")) {
        await eventModel.saveEventProcessError(event.id, json.error);
      } else {
        await eventModel.saveEventProcess(
          event.id,
          json.SF1.F1_DOC,
          json.SF1.F1_EMISSAO
        );
        jsonArr.push({ ...json });
      }

      const checkPendingEvents = await eventModel.lengthEventsOpen("cte");
      checkPendingEvents.events > 0 ? (stopLoop = false) : (stopLoop = true);
    }
  }

  return jsonArr;
};

const processPendingEvents = async () => {
  const openEvents = [];
  const pendingEvents = await eventModel.getEventProcessPendingLength();

  if (pendingEvents.events > 0) {
    const events = await eventModel.getEventProcessPending();

    await Promise.all(
      _.map(events, async (event) => {
        let handling;

        parser.parseString(
          Buffer.from(event.xml, "base64").toString("utf8"),
          async (err, result) => {
            event.xml = result;
          }
        );

        if (event.type === "nfe") {
          handling = await handlingNfe.makeJson(event);
        } else if (event.type === "nfse") {
          handling = await handlingNfse.makeJson(event);
        } else if (event.type === "cte") {
          handling = await handlingCte.makeJson(event);
        }

        if (!handling.hasOwnProperty("error")) {
          openEvents.push(event.id);
        }
      })
    );
  }

  if (!_.isEmpty(openEvents)) {
    await eventModel.openPendingEvent(openEvents);
  }
};

async function main() {
  let nfeJson = [];
  let nfseJson = [];
  let cteJson = [];

  console.log("Iniciando módulo de leitura");

  await processPendingEvents();

  const nfeOpenEvents = await eventModel.lengthEventsOpen("nfe");
  const nfeOpeneventsLength = nfeOpenEvents.events;

  const nfseOpenEvents = await eventModel.lengthEventsOpen("nfse");
  const nfseOpeneventsLength = nfseOpenEvents.events;

  const cteOpenEvents = await eventModel.lengthEventsOpen("cte");
  const cteOpeneventsLength = cteOpenEvents.events;

  console.log(
    `Total de notas a serem processadas: ${
      nfeOpeneventsLength + nfseOpeneventsLength + cteOpeneventsLength
    }, (${nfeOpeneventsLength}) NFE - (${nfseOpeneventsLength}) NFSE -(${cteOpeneventsLength}) CTE `
  );

  if (nfeOpeneventsLength > 0) {
    const nfeProcess = await processNfe();
    nfeJson = [...nfeProcess];
  }

  if (nfseOpeneventsLength > 0) {
    const nfseProcess = await processNfse();
    nfseJson = [...nfseProcess];
  }

  if (cteOpeneventsLength > 0) {
    const cteProcess = await processCte();
    cteJson = [...cteProcess];
  }

  console.log(
    `Notas processadas: (${nfeJson.length}) NFE - (${nfseJson.length}) NFSE - (${cteJson.length}) CTE`
  );

  const pendingEvents = await eventModel.getEventProcessPendingLength();

  if (pendingEvents.events > 0) {
    console.log(
      `\nExistem (${pendingEvents.events}) eventos pendentes, nossa equipe de suporte já está ciente e em breve lançaremos uma atualização`
    );
    console.log("para contemplar novos layouts ou cidades\n");
  }

  console.log("Leitura de arquivos concluída com sucesso");

  return { nfe: nfeJson, nfse: nfseJson, cte: cteJson };
}

module.exports = {
  main,
};
