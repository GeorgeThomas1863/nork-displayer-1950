import axios from "axios";
import CONFIG from "../config/config.js";

export const handleIncomingAPI = async (inputParams) => {
  console.log("BUILD");
};

export const handleOutgoingAPI = async (inputParams) => {
  const { apiOutgoingRoute, scrapePort } = CONFIG;
  const url = `https://localhost:${scrapePort}${apiOutgoingRoute}`;

  try {
    const res = await axios.post(url, inputParams);
    return res.data;
  } catch (e) {
    console.error(e);
    return res.status(500).json({ e: "Failed to get admin backend data" });
  }
};
