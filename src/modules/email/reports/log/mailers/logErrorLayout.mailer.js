const moment = require('moment');
const _ = require('lodash');
const fs = require('fs');
const mail = require('../../../email.config');
const logErrorLayoutTemplate = require('../template/logErrorLayout.template');
const structure = require('../../../../../modules/structure');

const dirs = structure.dir;

async function sendErrorLayoutLog() {
  const mailerList = [mail.defaultMailers.npcsolucoes];
  const mailerTemplate = await logErrorLayoutTemplate.template();
  const attachments = await loadAttachments();

  const mailOptions = {
    from: mailerList,
    to: mailerList,
    subject: `${moment().format('DD/MM/YYYY HH:mm:ss')} ERRO [IMPORTANTE] - LAYOUT`,
    html: mailerTemplate,
    attachments,
  };

  const send = await mail.transporter.sendMail(mailOptions);
  if (send) return true;
  return false;
}

async function loadAttachments() {
  const arrDir = [];
  const logLayoutFiles = fs.readdirSync(dirs.logLayout, { encoding: 'utf8' });

  if (!_.isEmpty(logLayoutFiles)) {
    _.map(logLayoutFiles, async file => {
      arrDir.push({
        file,
        path: `${dirs.logLayout}/${file}`
      })
    })
  }

  return arrDir;
}

module.exports = { sendErrorLayoutLog }
