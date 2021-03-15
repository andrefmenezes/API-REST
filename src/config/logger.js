const { createLogger, format, transports } = require("winston");
const path = require("path");
const moment = require("moment");
moment.locale("pt-BR");

const myCustomLevels = {
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  },
};

module.exports = createLogger({
  levels: myCustomLevels.levels,
  format: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf(
      (info) =>
        `[${moment(info.timestamp).format()}] ${info.level} ${info.message}`
    )
  ),

  transports: [
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      filename: path.join(__dirname + "/../logs/", "error.log"),
      level: process.env.debug === "true" ? "debug" : "notice",
    }),
    new transports.Console({
      level: process.env.debug === "true" ? "debug" : "error",
    }),
  ],
});
