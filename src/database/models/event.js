const _ = require("lodash");
const Promise = require("bluebird");
const db = require("../../config/db");

async function saveEvents(events) {
  try {
    return await Promise.all(
      _.map(events, async (event) => {
        setTimeout(async () => {
          await saveEventQuery(event);
        }, 0);
      })
    );
  } catch (error) {
    return false;
  }
}

function lengthEventsOpen(eventType) {
  try {
    return db("tb_event_1")
      .count("id as events")
      .where("ds_xml_type_1", eventType)
      .andWhere("st_processed_1", false)
      .andWhere("ie_status_1", 0)
      .first();
  } catch (error) {
    return false;
  }
}

async function saveEventQuery(event) {
  try {
    return await db("tb_event_1").insert({
      ds_cnpj_1: event.cnpj,
      ds_xml_type_1: event.type,
      fl_xml_1: event.blob,
    });
  } catch (error) {
    return false;
  }
}

function getEventProcess(eventType) {
  return db("tb_event_1")
    .select(
      "id",
      "ds_cnpj_1 as cnpj",
      "ds_xml_type_1 as type",
      "fl_xml_1 as xml"
    )
    .where("st_processed_1", false)
    .andWhere("ie_status_1", 0)
    .andWhere("ds_xml_type_1", eventType)
    .limit(1)
    .first();
}

function getEventProcessPending() {
  return db("tb_event_1")
    .select(
      "id",
      "ds_cnpj_1 as cnpj",
      "ds_xml_type_1 as type",
      "fl_xml_1 as xml"
    )
    .where("st_processed_1", false)
    .andWhere("ie_status_1", 2);
}

function getEventProcessPendingLength() {
  try {
    return db("tb_event_1")
      .count("id as events")
      .where("st_processed_1", false)
      .andWhere("ie_status_1", 2)
      .limit(1)
      .first();
  } catch (error) {
    return { events: 0 };
  }
}

function saveEventProcess(id, nfNumber, nfDate) {
  return db("tb_event_1")
    .update({
      ie_status_1: 1,
      dt_nf_1: nfDate,
      ds_nf_number_1: nfNumber,
    })
    .where("id", id);
}

function saveEventProcessError(id, error) {
  return db("tb_event_1")
    .update({
      ie_status_1: 2,
      ds_nf_error_1: error,
    })
    .where("id", id);
}

function getEventToExportLenght() {
  return db("tb_event_1")
    .count("id as events")
    .where("st_processed_1", false)
    .andWhere("ie_status_1", 1)
    .first();
}

function getEventToExport() {
  return db("tb_event_1")
    .select(
      "id",
      "ds_cnpj_1 as cnpj",
      "ds_xml_type_1 as type",
      "fl_xml_1 as xml",
      "dt_nf_1 as nfDate",
      "ds_nf_number_1 as nfNumber"
    )
    .where("st_processed_1", false)
    .andWhere("ie_status_1", 1)
    .limit(1)
    .first();
}

function closeEvent(id) {
  return db("tb_event_1")
    .update({
      st_processed_1: true,
    })
    .where("id", id);
}

function openPendingEvent(events) {
  try {
    return db.transaction(async (t) => {
      const promise = _.map(events, async (id) => openPendingEventQuery(id, t));
      return Promise.all(promise);
    });
  } catch (error) {
    false;
  }
}

function openPendingEventQuery(id, transaction) {
  return db("tb_event_1")
    .update({
      st_processed_1: false,
      ie_status_1: 0,
      ds_nf_error_1: null,
    })
    .where("id", id)
    .transacting(transaction);
}

function getErrorEventsToSendLog() {
  return db("tb_event_1")
    .select(
      "ds_cnpj_1 as cnpj",
      "ds_xml_type_1 as type",
      "fl_xml_1 as xml",
      "ds_nf_error_1 as error"
    )
    .where("ie_status_1", 2)
    .andWhere("st_processed_1", false);
}

module.exports = {
  saveEvents,
  openPendingEvent,
  lengthEventsOpen,
  getEventProcess,
  getEventProcessPending,
  getEventProcessPendingLength,
  saveEventProcess,
  saveEventProcessError,
  getEventToExportLenght,
  getEventToExport,
  closeEvent,
  getErrorEventsToSendLog,
};
