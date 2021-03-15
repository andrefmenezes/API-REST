const prompts = require("prompts");

const noLicenseFile = async () => {
  console.log(
    "\n\nNão foi localizado o arquivo de licença, por favor verifique a pasta"
  );
  console.log("raiz da aplicação, ou contate um administrador do sistema");
  await prompts({
    type: "text",
    name: "quit",
    message: "Encerrando o programa, motivo: Licença não encontrada",
  });
 // process.exit(1);
 process.beforeExit();
};

const licenseEmitError = async () => {
  console.log(
    "\n\nNão foi possível verificar a autencidade da licença,\n por favor contate um administrador do sistema"
  );
  await prompts({
    type: "text",
    name: "quit",
    message: "Encerrando o programa, motivo: Licença não autorizada",
  });
  //process.exit(1);
  process.beforeExit();
};

const computerNotAuthorized = async () => {
  console.log(
    "\n\nEste computador não está autorizado para utilização do sistema"
  );
  await prompts({
    type: "text",
    name: "quit",
    message: "Encerrando o programa, motivo: Computador não autorizado",
  });
  //process.exit(1);
  process.beforeExit();
};

const invalidApiKey = async () => {
  console.log(
    "\n\nAcesso não autorizado para o download de notas fiscais, por favor contate um administrador do sistema"
  );
  await prompts({
    type: "text",
    name: "quit",
    message:
      "Encerrando o programa, motivo: Acesso não autorizado para download de notas",
  });
  //process.exit(1);
  process.beforeExit();
};

const noMountingStructure = async () => {
  console.log(
    "\n\nOcorreu um erro ao gerar a estrutura de pastas, tente novamente por favor"
  );
  await prompts({
    type: "text",
    name: "quit",
    message: "Encerrando o programa, motivo: Erro ao gerar estrutura de pastas",
  });
  //process.exit(1);
  process.beforeExit();
};

const invalidSystemMode = async () => {
  console.log("\n\nInforme um módulo válido para execução do sistema");
  await prompts({
    type: "text",
    name: "quit",
    message: "Encerrando o programa, motivo: Não foi informado módulo válido",
  });
  //process.exit(1);
  process.beforeExit();
};

const errorJobMode = async () => {
  console.log(
    "\n\nOcorreu um erro ao executar o modo autómatico de notas fiscais, por favor reinicie o programa"
  );
  await prompts({
    type: "text",
    name: "quit",
    message: "Encerrando o programa, motivo: Não foi informado módulo válido",
  });
 // process.exit(1);
 process.beforeExit();
};

const errorImporterModule = async () => {
  console.log(
    "\n\nOcorreu um erro ao importar os xmls fiscais para base local"
  );
  await prompts({
    type: "text",
    name: "quit",
    message: "Encerrando o programa, motivo: erro ao importar os xmls fiscais",
  });
  //process.exit(1);
  process.beforeExit();
};

const ErrorSaveNfFiles = async () => {
  console.log(
    "\n\nOcorreu um erro ao arquivar os xmls fiscais, por favor entre em contato com o administrador do sistema"
  );
  await prompts({
    type: "text",
    name: "quit",
    message: "Encerrando o programa, motivo: erro ao arquivar os xmls fiscais",
  });
  //process.exit(1);
  process.beforeExit();
};

const errorConnectSiegApi = async () => {
  console.log(
    "\n\nNão foi possivel conectar com o banco de dados da SIEG, por favor tente novamente mais tarde ou reinicie o programa"
  );
  // await prompts({
  //   type: "text",
  //   name: "quit",
  //   message:
  //     "Encerrando o programa, motivo: erro ao conectar com a base de notas fiscais",
  // });
  //process.exit(1);
  process.beforeExit();
};

const errorConnectProtheusApi = async () => {
  console.log(
    "\n\nNão foi possivel conectar com o Protheus, por favor tente novamente mais tarde ou reinicie o programa"
  );
  // await prompts({
  //   type: "text",
  //   name: "quit",
  //   message: "Encerrando o programa, motivo: erro ao conectar com o protheus",
  // });
 // process.exit(1);  	
  process.beforeExit();
};

module.exports = {
  noLicenseFile,
  licenseEmitError,
  computerNotAuthorized,
  invalidApiKey,
  noMountingStructure,
  invalidSystemMode,
  errorJobMode,
  errorImporterModule,
  errorConnectSiegApi,
  errorConnectProtheusApi,
  ErrorSaveNfFiles,
};
