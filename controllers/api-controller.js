import axios from "axios";
import CONFIG from "../config/config.js";
import state from "../src/state-back.js";

export const getBackendValueController = async (req, res) => {
  const { key } = req.body;
  if (!key) return null;

  const value = CONFIG[key];

  return res.json({ value });
};

//api receive endpoint for displayer
export const apiEndpointController = async (req, res) => {
  try {
    const inputParams = req.body;

    console.log("API INCOMING DATA");
    console.log(inputParams);

    //ignore everything not from scraper
    if (inputParams.source !== "scraper") return null;

    //update state
    const { [inputParams.source]: _, ...updateObj } = inputParams;
    state = { ...updateObj };

    return res.json(state);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ e: "DISPLAYER FAILED TO GET INCOMING API DATA" });
  }
};

export const sendAdminCommandController = async (req, res) => {
  const inputParams = req.body;
  if (!inputParams) return null;
  const { scrapePort, apiScraper } = CONFIG;

  try {
    const url = `http://localhost:${scrapePort}${apiScraper}`;
    console.log(`SENDING API REQ TO ${url}`);

    const inputParams = req.body;
    console.log("API OUTGOING DATA");
    console.log(inputParams);

    const apiRes = await axios.post(url, inputParams);
    if (!apiRes) return null;
    const data = apiRes.data;

    console.log("API OUTGOING RESPONSE");
    console.log(data);
    return res.json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ e: "Failed to get admin backend data" });
  }
};

export const pollingController = async (req, res) => {
  // const inputParams = req.body;
  // if (!inputParams) return null;
  const stateData = state;

  return res.json(stateData);
};
