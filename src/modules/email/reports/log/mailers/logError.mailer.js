const moment = require('moment');
const path = require('path');
const fs = require('fs');
const mail = require('../../../email.config');
const logErrorTemplate = require('../template/logError.template');

async function sendErrorLog() {
  const mailerList = [mail.defaultMailers.npcsolucoes];
  const mailerTemplate = await logErrorTemplate.template();
  const attachments = await loadAttachments();

  const mailOptions = {
    from: mailerList,
    to: mailerList,
    subject: `${moment().format('DD/MM/YYYY HH:mm:ss')} ERRO - ACOMPANHAMENTO DE NF`,
    html: mailerTemplate,
    attachments,
  };

  const send = await mail.transporter.sendMail(mailOptions);
  if (send) return true;
  return false;
}

async function loadAttachments() {
  const arrDir = [];
  const directory = path.join(__dirname, `../../../../../${process.env.ERROR_LOG_PATH}`);
  const dir = fs.readdirSync(directory, { encoding: 'utf8' });

  dir.map(file => arrDir.push({
    filename: file,
    path: path.join(directory, file)
  }))

  return arrDir;
}

module.exports = { sendErrorLog }
