import axios from "axios";
import CONFIG from "../config/config.js";
import { handleIncomingAPI } from "../src/main.js";

export const getBackendValueController = async (req, res) => {
  const { key } = req.body;
  if (!key) return null;

  const value = CONFIG[key];

  res.json({ value });
};

export const apiIncomingController = async (req, res) => {
  const inputParams = req.body;

  const data = await handleIncomingAPI(inputParams);
  res.json(data);
};

export const apiOutgoingController = async (req, res) => {
  const { apiOutgoingRoute } = CONFIG;
  const url = `https://localhost:${apiOutgoingRoute}`;

  try {
    const inputParams = req.body;
    console.log("API OUTGOING DATA");
    console.log(inputParams);

    const res = await axios.post(url, inputParams);
    console.log("API OUTGOING RESPONSE");
    console.log(res.data);

    return res.data;
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
