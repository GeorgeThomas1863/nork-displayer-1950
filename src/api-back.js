import axios from "axios";
import CONFIG from "../config/config.js";

export const sendAdminCommand = async (inputParams) => {
  const { api } = CONFIG;

  try {
    const res = await axios.post(api, inputParams);

    console.log("API RESPONSE DATA");
    console.log(res.data);

    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
