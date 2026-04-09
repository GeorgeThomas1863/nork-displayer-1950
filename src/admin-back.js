import axios from "axios";

import dbModel from "../models/db-model.js";
import { dbGet } from "../middleware/db-config.js";

export const runAdminCommand = async (inputParams) => {
  //CREATE DISPLAYER ID

  try {
    const url = `http://localhost:${process.env.SCRAPE_PORT}${process.env.API_SCRAPER}`;
    // console.log(`SENDING API REQ TO ${url}`);
    // console.log("API OUTGOING DATA");
    // console.log(inputParams);

    const apiRes = await axios.post(url, { ...inputParams, password: process.env.API_PASSWORD });
    if (!apiRes) return null;
    const data = apiRes.data;

    const cmd = inputParams.command;
    if (cmd === "admin-start-scheduler" || cmd === "admin-stop-scheduler") {
      await dbGet()
        .collection("appConfig")
        .updateOne(
          { _id: "config" },
          { $set: { schedulerActive: cmd === "admin-start-scheduler" } },
          { upsert: true }
        );
    }

    // console.log("API OUTGOING RESPONSE");
    // console.log(data);
    return data;
  } catch (e) {
    console.error("ERROR:", e.message);
    return null;
  }
};

export const runGetAdminData = async () => {
  const collectionsArr = process.env.COLLECTIONSARR.split(",");

  const dataArray = [];
  for (const collection of collectionsArr) {
    try {
      const dataModel = new dbModel("", collection);
      const data = await dataModel.getAll(500);
      if (!data || !data.length) continue;

      const retunrObj = {
        collection: collection,
        data: data,
      };

      dataArray.push(retunrObj);
    } catch (e) {
      console.error("ERROR:", e.message);
      continue;
    }
  }

  return dataArray;
};

// export const getAdminLogs = async () => {
//   const dataModel = new dbModel("", "log");
//   const data = await dataModel.getAll();
//   return data;
// };
