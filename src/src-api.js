import axios from "axios";
import CONFIG from "../config/config.js";

//SENDS THE ADMIN COMMAND TO THE API
export const sendAdminStart = async (inputParams, onUpdate) => {
  const { apiStartURL, apiUpdateURL, updateInterval } = CONFIG;
  try {
    await axios.post(apiStartURL, inputParams);

    // Poll for updates
    const pollInterval = setInterval(async () => {
      const res = await axios.get(apiUpdateURL);
      onUpdate(res.data);

      if (res.data.complete) {
        clearInterval(pollInterval);
      }
    }, updateInterval);
  } catch (e) {
    console.log(e);
    return null;
  }
};
