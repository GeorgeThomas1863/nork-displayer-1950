import axios from "axios";
import CONFIG from "../config/config.js";

//SENDS THE ADMIN COMMAND TO THE API
export const sendAdminStart = async (inputParams, onUpdate) => {
  const { apiStartURL, apiUpdateURL, updateInterval } = CONFIG;
  try {
    const res = await axios.post(apiStartURL, inputParams);

    // Poll for updates
    const pollInterval = setInterval(async () => {
      const updateRes = await axios.get(apiUpdateURL);
      onUpdate(updateRes.data);

      if (updateRes.data.complete) {
        clearInterval(pollInterval);
      }
    }, updateInterval);

    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
