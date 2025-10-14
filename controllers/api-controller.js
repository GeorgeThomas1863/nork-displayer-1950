import axios from "axios";
import CONFIG from "../config/config.js";
import kcnaState from "../src/state-kcna.js";
import { runUpdateData } from "../src/control.js";

export const updateDataController = async (req, res) => {
  const { stateFront } = req.body;
  const data = await runUpdateData(stateFront);
  return res.json(data);
};

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

    // other update method, could be easier / better
    // delete inputParams.source;
    // kcnaState = inputParams;

    //update state with loop
    const { [inputParams.source]: _, ...updateObj } = inputParams;
    for (let key in updateObj) {
      if (updateObj[key] === null) continue;
      kcnaState[key] = updateObj[key];
    }

    return res.json(state);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ e: "DISPLAYER FAILED TO GET INCOMING API DATA" });
  }
};

export const adminCommandController = async (req, res) => {
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
  const stateData = kcnaState;

  return res.json(stateData);
};
