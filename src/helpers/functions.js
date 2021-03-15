const fs = require('fs');
const moment = require('moment')
const path = require('path');

// const rootPathLog = path.join(__dirname, '../../../nf/log');
// const successLogPath = path.join(__dirname, `../../../${process.env.SUCCESS_LOG_PATH}`);
// const errorLogPath = path.join(__dirname, `../../../${process.env.ERROR_LOG_PATH}`);

async function onlyNumber(data) {
  return await (data) ? data.match(/[0-9]/g).join('') : '';
}

async function xmlFormatDate(data) {
  return await (data) ? data.split('T')[0].match(/[0-9]/g).join('') : '';
}

async function saveErrorLog(city, fiscalNote, error) {
 /*  fs.writeFile(`${errorLogPath}/errorLog_${moment().format('YYYYMMDDHHmmss')}.log`,
    `${new Date}\nCidade:${city.name}-${city.IBGECode}\nError:${error}\nNota:${JSON.stringify(fiscalNote)}\n`,
    { encoding: 'utf8', flag: 'a+' }, (err) => {
      if (err) throw err;
    }
  ); */
}

async function monthExtension(month) {
  const monthName = '';

  switch (month) {
    case '01':
      monthName = 'janeiro';
      break;
    case '02':
      monthName = 'fevereiro';
      break;
    case '03':
      monthName = 'marco';
      break;
    case '04':
      monthName = 'abril';
      break;
    case '05':
      monthName = 'maio';
      break;
    case '06':
      monthName = 'junho';
      break;
    case '07':
      monthName = 'julho';
      break;
    case '08':
      monthName = 'agosto';
      break;
    case '09':
      monthName = 'setembro';
      break;
    case '10':
      monthName = 'outubro';
      break;
    case '11':
      monthName = 'novembro';
      break;
    case '12':
      monthName = 'dezembro';
      break;
  }

  return monthName;
}

async function getTypeFinNfe(data) {
  return (data === '4') ? 'D' : 'N';
}

module.exports = {
  onlyNumber,
  xmlFormatDate,
  saveErrorLog,
  monthExtension,
  getTypeFinNfe,
}
