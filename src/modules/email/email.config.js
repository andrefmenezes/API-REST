const nodemailer = require('nodemailer');

const config = {
  email: 'nfimporterlog@npcsolucoes.com.br',
  pass: '##fiscalnote',
};

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com.br',
  port: 587,
  secure: false,
  auth: {
    user: config.email,
    pass: config.pass,
  },
  this: { rejectUnauthorized: false },
});

const defaultMailers = {
  npcsolucoes: 'nfimporterlog@npcsolucoes.com.br',
}

module.exports = { transporter, defaultMailers };
