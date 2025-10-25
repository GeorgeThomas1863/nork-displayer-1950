import axios from "axios";
import CONFIG from "../config/config.js";

import dbModel from "../models/db-model.js";

export const runAdminCommand = async (inputParams) => {
  const { scrapePort, apiScraper } = CONFIG;

  //CREATE DISPLAYER ID

  try {
    const url = `http://localhost:${scrapePort}${apiScraper}`;
    console.log(`SENDING API REQ TO ${url}`);
    console.log("API OUTGOING DATA");
    console.log(inputParams);

    const apiRes = await axios.post(url, inputParams);
    if (!apiRes) return null;
    const data = apiRes.data;

    console.log("API OUTGOING RESPONSE");
    console.log(data);
    return data;
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

export const runGetAdminData = async () => {
  const { collectionsArr } = CONFIG;

  const dataArray = [];
  for (const collection of collectionsArr) {
    try {
      const dataModel = new dbModel("", collection);
      const data = await dataModel.getAll();
      if (!data || !data.length) continue;

      const retunrObj = {
        collection: collection,
        data: data,
      };

      dataArray.push(retunrObj);
    } catch (e) {
      console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
      continue;
    }
  }

  return dataArray;
};
