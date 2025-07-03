import axios from "axios";
import CONFIG from "../config/config.js";

//SENDS THE ADMIN COMMAND TO THE API
export const sendAdminStart = async (inputParams) => {
  const { apiStartURL } = CONFIG;

  try {
    const res = await axios.post(apiStartURL, inputParams);
    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const sendAdminUpdate = async () => {
  const { apiUpdateURL } = CONFIG;

  try {
    const res = await axios.get(apiUpdateURL);
    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
