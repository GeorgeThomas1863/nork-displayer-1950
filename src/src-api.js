import axios from "axios";
import CONFIG from "../config/config.js";

//SENDS THE ADMIN COMMAND TO THE API
export const sendAdminStart = async (inputParams, onUpdate) => {
  const { apiStartURL, apiUpdateURL, updateInterval } = CONFIG;

  //TURN OFF
  const testInterval = updateInterval / 60;

  try {
    const res = await axios.post(apiStartURL, inputParams);

    // Poll for updates
    const pollInterval = setInterval(async () => {
      try {
        const updateRes = await axios.get(apiUpdateURL);
        onUpdate(updateRes.data);

        if (updateRes.data.finished) {
          clearInterval(pollInterval);
        }
      } catch (e) {
        console.log("Error polling for updates");
        console.log(e);
      }
    }, testInterval);

    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
