const _ = require("lodash");
const cteV3 = require("./patterns/cte/cte-v3");

async function findCityCode(result) {
  try {
    return result.cteProc.CTe[0].infCte[0].ide[0].cMunEnv[0];
  } catch (error) {
    return false;
  }
}

async function makeJson(event) {
  let city;

  try {
    city = await findCityCode(event.xml);

    if (city === false || city === null || city === undefined)
      return { error: "layout" };

    const processFile = await cteV3.makeJson(event.cnpj, event.xml);

    return processFile;
  } catch (error) {
    return { error: "layout" };
  }
}

module.exports = {
  makeJson,
};
