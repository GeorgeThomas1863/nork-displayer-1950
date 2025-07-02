import axios from "axios";
import CONFIG from "../config/config.js";

//SENDS THE ADMIN COMMAND TO THE API
export const sendAdminCommand = async (inputParams) => {
  const { apiURL } = CONFIG;
  try {
    const res = await axios.post(apiURL, inputParams);

    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
