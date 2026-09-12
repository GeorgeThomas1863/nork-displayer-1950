import axios from "axios";

import dbModel from "../models/db-model.js";

//every scraper command returns fast (scrapes run unawaited server-side)
const SCRAPER_API_TIMEOUT_MS = 15000;

export const runAdminCommand = async (inputParams) => {
  try {
    const scraperHost = process.env.SCRAPER_HOST || "localhost";
    const url = `http://${scraperHost}:${process.env.SCRAPE_PORT}${process.env.API_SCRAPER}`;
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

//collections counted per-scrapeId to build each log row's scrapeStats
const STAT_COLLECTIONS = ["articles", "pics", "picSets"];

//stat columns are computed after the log query runs, so they sort in JS, not in mongo
const STAT_SORT_COLUMNS = ["articles", "pics", "picSets"];

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
    const logRows = await dataModel.getSortedItemsArray();
    const stats = await dataModel.getLogStatsSummary();

    const scrapeIdCountsByCollection = await getScrapeIdCountsByCollection();
    const dataWithStats = attachScrapeStats(logRows, scrapeIdCountsByCollection);
    const data = sortByStatColumn(dataWithStats, sortColumn, sortDir);

    return { collection: "log", count, data, stats };
  } catch (e) {
    console.error("ADMIN DATA ERROR FOR log:", e.message);
    return null;
  }
};

//one aggregation per stat collection -> { articles: { [scrapeId]: count }, pics: {...}, picSets: {...} }
const getScrapeIdCountsByCollection = async () => {
  const countsByCollection = {};
  for (const collection of STAT_COLLECTIONS) {
    const dataModel = new dbModel("", collection);
    countsByCollection[collection] = await dataModel.getScrapeIdCounts();
  }
  return countsByCollection;
};

//attach a { articles, pics, picSets } scrapeStats object to each log row, 0 when no docs match
const attachScrapeStats = (logRows, countsByCollection) => {
  const rowsWithStats = [];
  for (const row of logRows) {
    const scrapeStats = {};
    for (const collection of STAT_COLLECTIONS) {
      scrapeStats[collection] = countsByCollection[collection][row.scrapeId] || 0;
    }
    rowsWithStats.push({ ...row, scrapeStats });
  }
  return rowsWithStats;
};

//scrapeStats columns can't be sorted by the mongo query since they're computed after it runs
const sortByStatColumn = (logRows, sortColumn, sortDir) => {
  if (!STAT_SORT_COLUMNS.includes(sortColumn)) return logRows;

  const dir = sortDir === "asc" ? 1 : -1;
  const sortedRows = [...logRows];
  sortedRows.sort((rowA, rowB) => (rowA.scrapeStats[sortColumn] - rowB.scrapeStats[sortColumn]) * dir);
  return sortedRows;
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
