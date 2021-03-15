const fs = require("fs");
const path = require("path");
const prompts = require("prompts");
const zipFolder = require("zip-a-folder");
const logger = require("../../config/logger");
const error = require("../error");
const version = require("../../../package.json").version;

const folderNewApp = `${process.cwd()}/dist/new`;

const promptQuestions = async () => {
  const questions = [
    {
      type: "text",
      name: "customer",
      message: "Nome do cliente",
    },
  ];

  const response = await prompts(questions);
  return response;
};

verifyHasFiles = async () => {
  return Promise.resolve(
    fs.readdir(folderNewApp, function (err, files) {
      if (err) {
        return error.handleError(
          `Erro na leitura do diretório ${folderNewApp}`
        );
      } else {
        if (files.length) {
          return true;
        } else {
          return error.handleError(
            `Erro na leitura do diretório ${folderNewApp}`
          );
        }
      }
    })
  )
    .then(() => true)
    .catch((err) => {
      throw new Error("Erro ao verificar pasta");
    });
};

zipNewApp = async (customer) => {
  await verifyHasFiles();
  return Promise.resolve(
    zipFolder.zipFolder(
      folderNewApp,
      `${process.cwd()}/dist/${customer}/${customer}-v${version}.zip`,
      function (err) {
        if (err) {
          console.log("Something went wrong!", err);
        }
      }
    )
  )
    .then(() => true)
    .catch((err) => {
      throw new Error("Erro ao zipar arquivos");
    });
};

const main = async () => {
  const data = await promptQuestions();
  const dir = {
    dist: `${process.cwd()}/dist`,
    customer: `${process.cwd()}/dist/${data.customer}`,
  };

  //Verificando e criando a pasta do cliente
  if (!fs.existsSync(dir.customer)) fs.mkdirSync(dir.customer);

  //Copiando os arquivos necessários para criação do zip
  fs.copyFileSync(
    `${dir.dist}/node_sqlite3.node`,
    `${folderNewApp}/node_sqlite3.node`
  );

  fs.copyFileSync(
    `${dir.dist}/fiscal_note.blank.db`,
    `${folderNewApp}/fiscal_note.db`
  );

  //Criando o pacote .zip com os arquivos do app
  await zipNewApp(data.customer);

  //Removendo os arquivos do app
  fs.rmdirSync(folderNewApp, { recursive: true });
};

main();
