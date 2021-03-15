const _ = require("lodash");
const axios = require("axios");
const config = require("../../config/global");
const eventModel = require("../../database/models/event");
const logger = require("../../config/logger");

const sendErrorEvents = async () => {
  const sendEventsLog = await eventModel.getErrorEventsToSendLog();

  if (!_.isEmpty(sendEventsLog)) {
    console.log("Enviando eventos de erro para o suporte técnico");
    logger.error(JSON.parse(sendEventsLog));

    try {
      const send = await axios.default.post(
        config.routes.sendErrorLogEvents,
        sendEventsLog
      );

      if (send.status == "200") {
        console.log("Eventos enviados com sucesso");
      } else {
        console.log(
          "Ocorreu um erro de comunicação ao enviar os eventos de erro"
        );
      }
    } catch (error) {
      console.log(error);
      console.log(
        "Ocorreu um erro de comunicação ao enviar os eventos de erro"
      );
    }
  }
};

module.exports = {
  sendErrorEvents,
};
