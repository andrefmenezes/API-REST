const moment = require('moment');
const path = require('path');
const fs = require('fs');
const mail = require('../../../email.config');
const logSuccessTemplate = require('../template/logSuccess.template');


async function sendSuccessLog() {
  const mailerList = [process.env.SUCCESS_LOG_EMAIL];
  const mailerTemplate = await logSuccessTemplate.template();
  const attachments = await loadAttachments();

  const mailOptions = {
    from: mailerList,
    to: mailerList,
    subject: `${moment().format('DD/MM/YYYY HH:mm:ss')} ACOMPANHAMENTO DE NF`,
    html: mailerTemplate,
    attachments
  };

  const send = await mail.transporter.sendMail(mailOptions);
  if (send) return true;
  return false;
}

async function loadAttachments() {
  const arrDir = [];
  const directory = path.join(__dirname, `../../../../../${process.env.SUCCESS_LOG_PATH}`);
  const dir = fs.readdirSync(directory, { encoding: 'utf8' });

  dir.map(file => arrDir.push({
    filename: file,
    path: path.join(directory, file)
  }))

  return arrDir;
}

module.exports = { sendSuccessLog }
