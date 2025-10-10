import axios from "axios";
import CONFIG from "../config/config.js";
import { handleIncomingAPI } from "../src/control.js";

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

    const data = await handleIncomingAPI(inputParams);
    console.log("API INCOMING RESPONSE");
    console.log(data);

    return res.json(data);
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

// export const sendAdminCommand = async (inputParams) => {
//   const { api } = CONFIG;

//   try {
//     const res = await axios.post(api, inputParams);

//     console.log("API RESPONSE DATA");
//     console.log(res.data);

//     return res.data;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// };

// export const adminDataRouteController = async (req, res) => {
//   try {
//     const inputParams = req.body;

//     const data = await sendAdminCommand(inputParams);
//     return res.json(data);
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ e: "Failed to get admin backend data" });
//   }
// };
