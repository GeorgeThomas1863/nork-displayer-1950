import axios from "axios";
import CONFIG from "../config/config.js";
import kcnaState from "../src/kcna/state-kcna.js";
import { runUpdateDisplayData } from "../src/main-back.js";
import { runAdminCommand, runAdminCurrentData } from "../src/admin-back.js";

export const getBackendValueController = async (req, res) => {
  const { key } = req.body;
  if (!key) return null;

  const value = CONFIG[key];

  return res.json({ value });
};

export const updateDisplayDataController = async (req, res) => {
  const { stateFront } = req.body;

  const data = await runUpdateDisplayData(stateFront);
  return res.json(data);
};

//--------------------

export const adminCurrentDataController = async (req, res) => {};

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

export const adminPollingController = async (req, res) => {
  // const inputParams = req.body;
  // if (!inputParams) return null;
  const stateData = kcnaState;

  return res.json(stateData);
};
