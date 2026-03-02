import axios from "axios";
import CONFIG from "../middleware/config.js";

import dbModel from "../models/db-model.js";

export const runAdminCommand = async (inputParams) => {
  const { scrapePort, apiScraper } = CONFIG;

  //CREATE DISPLAYER ID

  try {
    const url = `http://localhost:${scrapePort}${apiScraper}`;
    // console.log(`SENDING API REQ TO ${url}`);
    // console.log("API OUTGOING DATA");
    // console.log(inputParams);

    const apiRes = await axios.post(url, { ...inputParams, apiPassword: CONFIG.apiPassword });
    if (!apiRes) return null;
    const data = apiRes.data;

    // console.log("API OUTGOING RESPONSE");
    // console.log(data);
    return data;
  } catch (e) {
    console.error("ERROR:", e.message);
    return null;
  }
};

export const runGetAdminData = async () => {
  const { collectionsArr } = CONFIG;

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
