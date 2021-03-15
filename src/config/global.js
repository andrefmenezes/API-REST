const cities = {
  SALVADOR: {
    IBGECode: "2927408",
    name: "SALVADOR",
    active: true,
  },
  RECIFE: {
    IBGECode: "2611606",
    name: "RECIFE",
    active: true,
  },
  CAMPINA_GRANDE: {
    IBGECode: "2504009",
    name: "CAMPINA GRANDE",
    active: true,
  },
  CARUARU: {
    IBGECode: "2604106",
    name: "CARUARU",
    active: true,
  },
  FORTALEZA: {
    IBGECode: "2304400",
    name: "FORTALEZA",
    active: true,
  },
  JOAO_PESSOA: {
    IBGECode: "2507507",
    name: "JOÃO PESSOA",
    active: true,
  },
  SERGIPE: {
    IBGECode: "2800308",
    name: "SERGIPE",
    active: true,
  },
  MACEIO: {
    IBGECode: "2704302",
    name: "MACEIÓ",
    active: true,
  },
  JABOATAO: {
    IBGECode: "2607901",
    name: "JABOATÃO",
    active: true,
  },
  CAMARAGIBE: {
    IBGECode: "2603454",
    name: "CAMARAGIBE",
    active: true,
  },
  PAULISTA: {
    IBGECode: "2610707",
    name: "PAULISTA",
    active: true,
  },
  RIO_DE_JANEIRO: {
    IBGECode: "3304557",
    name: "RIO DE JANEIRO",
    active: true,
  },
  SAO_PAULO: {
    IBGECode: "3550308",
    name: "SÃO PAULO",
    active: true,
  },
  RIBEIRAO_PRETO: {
    IBGECode: "3543402",
    name: "RIBEIRÃO PRETO",
    active: true,
  },
  NATAL: {
    IBGECode: "2408102",
    name: "NATAL",
    active: true,
  },
  NOSSA_SENHORA_DO_SOCORRO: {
    IBGECode: "2804805",
    name: "NOSSA SENHORA DO SOCORRO",
    active: true,
  },
  ABREU_E_LIMA: {
    IBGECode: "2600054",
    name: "ABREU E LIMA",
    active: true,
  },
  TIJUCAS: {
    IBGECode: "4218004",
    name: "TIJUCAS",
    active: true,
  },
  ITAJAI: {
    IBGECode: "4208203",
    name: "ITAJAÍ",
    active: true,
  },
};

const timeout = {
  timeoutImporter: 3600000,
  timeoutExporter: 60000,
  timeoutValidation: 60000,
};

const routes = {
  siegCatchXmlsApi: "https://api.sieg.com/aws/api-xml-search.ashx",
  sendErrorLogEvents: "http://31.220.59.242:3000/event/error", // Final servidor
};

module.exports = {
  cities,
  timeout,
  routes,
};
