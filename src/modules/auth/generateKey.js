const prompts = require('prompts');
const jwt = require('jsonwebtoken');
const macaddress = require('macaddress');
const fs = require('fs');

const promptQuestions = async() => {
  const questions = [
    {
      type: 'text',
      name: 'customer',
      message: 'Nome do cliente',
    },
    {
      type: 'text',
      name: 'cnpj',
      message: 'Informe os cnpj vinculados (informe apenas numeros separando cada cnpj com . ex: 00000000000000.11111111111111) ',
    },
    {
      type: 'text',
      name: 'apikey',
      message: 'Chave API SIEG',
    },
    {
      type: 'text',
      name: 'apikeyemail',
      message: 'Email SIEG',
    },
    {
      type: 'text',
      name: 'protheusImporterApi',
      message: 'Url API Protheus',
    },
    {
      type: 'text',
      name: 'protheusUser',
      message: 'Usuário Protheus(base64)',
    },
    {
      type: 'select',
      name: 'onlythispc',
      message: 'vincular licença a esta máquina ?',
      choices: [
        { title: 'Sim', value: true },
        { title: 'Não', value: false }
      ]
    }
  ]

  const response = await prompts(questions);
  return response;
}

const main = async() => {
  let address;
  macaddress.one(function (err, mac) { address = mac; });

  const data = await promptQuestions();

  if (data.onlythispc == true ) {
    data.mac = address;
  } else {
    data.mac = false;
  }

  const token = jwt.sign(data, 'Qm9seiBoeXBFcnggLyopKMO8IEJyI2dodA==');

  //Verificando e criando a pasta do novo app
  if (!fs.existsSync(`${process.cwd()}/dist/new`)) fs.mkdirSync(`${process.cwd()}/dist/new`);

  fs.writeFileSync(`${process.cwd()}/dist/new/license.key`, token);

  console.log('Licença gerada com sucesso');

  prompts({ type: 'text', name: 'l', message: '...' });
}

main();
