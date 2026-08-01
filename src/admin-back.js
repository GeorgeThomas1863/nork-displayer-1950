import axios from "axios";

import dbModel from "../models/db-model.js";

//every scraper command returns fast (scrapes run unawaited server-side)
const SCRAPER_API_TIMEOUT_MS = 15000;

export const runAdminCommand = async (inputParams) => {
  try {
    const url = `http://localhost:${process.env.SCRAPE_PORT}${process.env.API_SCRAPER}`;
    const apiRes = await axios.post(url, { ...inputParams, password: process.env.API_PASSWORD }, { timeout: SCRAPER_API_TIMEOUT_MS });
    return buildCommandSuccess(apiRes?.data);
  } catch (e) {
    console.error("SCRAPER API ERROR:", e.message);
    return buildCommandFailure(e);
  }
};

const buildCommandSuccess = (data) => {
  if (!data) return { success: false, message: "Scraper returned no data", data: { status: 502 } };
  if (typeof data.success === "boolean") return buildStructuredCommandResult(data);
  const message = data.scrapeMessage || data.message || "Scraper command completed";
  return { success: true, message, data };
};

const buildStructuredCommandResult = ({ success, message, data }) => {
  return { success, message: message || "Scraper command completed", data };
};

const buildCommandFailure = (error) => {
  const status = error.response?.status || 503;
  const message = error.response?.data?.error || "Scraper service is unavailable";
  return { success: false, message, data: { status } };
};

//column -> mongo field(s) for the admin log sort
const LOG_SORT_FIELDS = {
  id: ["_id"],
  status: ["scrapeError", "scrapeActive"],
  startTime: ["scrapeStartTime"],
  endTime: ["scrapeEndTime"],
  duration: ["scrapeLengthSeconds"],
  step: ["scrapeStep"],
  message: ["scrapeMessage"],
  active: ["scrapeActive"],
};

export const runGetAdminData = async ({ sortColumn, sortDir } = {}) => {
  const countOnlyCollections = ["articles", "pics", "picSets", "vidPages"];
  const dataArray = [];

  const logData = await getAdminLogData(sortColumn, sortDir);
  if (!logData) return null;
  dataArray.push(logData);

  for (const collection of countOnlyCollections) {
    const collectionData = await getAdminCollectionCount(collection);
    if (!collectionData) return null;
    dataArray.push(collectionData);
  }

  return dataArray;
};

//build the mongo sort object for the log collection, always tiebroken by _id
const buildLogSortObject = (sortColumn, sortDir) => {
  const dir = sortDir === "asc" ? 1 : -1;
  const fields = LOG_SORT_FIELDS[sortColumn] || LOG_SORT_FIELDS.endTime;

  const sortObj = {};
  for (const field of fields) {
    sortObj[field] = dir;
  }
  sortObj._id = dir;

  return sortObj;
};

const getAdminLogData = async (sortColumn, sortDir) => {
  try {
    const howMany = +process.env.DEFAULT_LOAD_LOG || 100;
    const sortObj = buildLogSortObject(sortColumn, sortDir);
    const dataModel = new dbModel({ sortObj, howMany }, "log");

    const count = await dataModel.countAll();
    const data = await dataModel.getSortedItemsArray();
    const stats = await dataModel.getLogStatsSummary();
    return { collection: "log", count, data, stats };
  } catch (e) {
    console.error("ADMIN DATA ERROR FOR log:", e.message);
    return null;
  }
};

const getAdminCollectionCount = async (collection) => {
  try {
    const dataModel = new dbModel("", collection);
    const count = await dataModel.countAll();
    return { collection, count };
  } catch (e) {
    console.error(`ADMIN DATA ERROR FOR ${collection}:`, e.message);
    return null;
  }
};
