import axios from "axios";

import dbModel from "../models/db-model.js";

export const runAdminCommand = async (inputParams) => {
  try {
    const url = `http://localhost:${process.env.SCRAPE_PORT}${process.env.API_SCRAPER}`;
    const apiRes = await axios.post(url, { ...inputParams, password: process.env.API_PASSWORD });
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

export const runGetAdminData = async () => {
  const collections = ["log", "articles", "pics", "picSets", "vidPages"];
  const dataArray = [];

  for (const collection of collections) {
    const collectionData = await getAdminCollectionData(collection);
    if (!collectionData) return null;
    dataArray.push(collectionData);
  }

  return dataArray;
};

const getAdminCollectionData = async (collection) => {
  try {
    const dataModel = new dbModel("", collection);
    const count = await dataModel.countAll();
    const data = await dataModel.getAll(500);
    return { collection, count, data };
  } catch (e) {
    console.error(`ADMIN DATA ERROR FOR ${collection}:`, e.message);
    return null;
  }
};

// export const getAdminLogs = async () => {
//   const dataModel = new dbModel("", "log");
//   const data = await dataModel.getAll();
//   return data;
// };
