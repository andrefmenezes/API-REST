const moment = require('moment');
const _ = require('lodash');
const fs = require('fs');
const mail = require('../../../email.config');
const logErrorCityNotRegistredTemplate = require('../template/logErrorCityNotRegistred.template');
const structure = require('../../../../structure');

const dirs = structure.dir;

async function sendErrorCityNotRegistredLog() {
  const mailerList = [mail.defaultMailers.npcsolucoes];
  const mailerTemplate = await logErrorCityNotRegistredTemplate.template();
  const attachments = await loadAttachments();

  const mailOptions = {
    from: mailerList,
    to: mailerList,
    subject: `${moment().format('DD/MM/YYYY HH:mm:ss')} ERRO [IMPORTANTE] - CIDADE NÃO CADASTRADA`,
    html: mailerTemplate,
    attachments,
  };

  const send = await mail.transporter.sendMail(mailOptions);
  if (send) return true;
  return false;
}

async function loadAttachments() {
  const arrDir = [];
  const logCityFiles = fs.readdirSync(dirs.logCity, { encoding: 'utf8' });

  if (!_.isEmpty(logCityFiles)) {
    _.map(logCityFiles, async file => {
      arrDir.push({
        filename: file,
        path: `${dirs.logCity}/${file}`
      })
    })
  }

  return arrDir;
}

module.exports = { sendErrorCityNotRegistredLog }
