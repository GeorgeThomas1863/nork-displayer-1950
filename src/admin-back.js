import axios from "axios";
import CONFIG from "../config/config.js";

export const runAdminCommand = async (inputParams) => {
  const { scrapePort, apiScraper } = CONFIG;

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

export const runAdminCurrentData = async () => {};
