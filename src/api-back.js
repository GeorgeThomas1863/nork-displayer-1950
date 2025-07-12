import axios from "axios";
import CONFIG from "../config/config.js";

//SENDS THE ADMIN COMMAND TO THE API
// export const sendAdminStart = async (inputParams) => {
export const sendAdminCommand = async (inputParams) => {
  const { scrapeURL } = CONFIG;

  try {
    const res = await axios.post(scrapeURL, inputParams);

    console.log("API RESPONSE DATA");
    console.log(res.data);

    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const sendKcnaWatchCommand = async () => {
  const { kcnaWatchURL } = CONFIG;

  try {
    const res = await axios.post(kcnaWatchURL, inputParams);

    console.log("API RESPONSE DATA");
    console.log(res.data);

    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
