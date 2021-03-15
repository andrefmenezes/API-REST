const send = {
  ...require('./reports/log/mailers/logError.mailer'),
  ...require('./reports/log/mailers/logSuccess.mailer'),
  ...require('./reports/log/mailers/logErrorLayout.mailer'),
  ...require('./reports/log/mailers/logErrorCityNotRegistred.mailer'),
}

module.exports = send;


