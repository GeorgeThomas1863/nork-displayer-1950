import axios from "axios";
import CONFIG from "../config/config.js";

// //SENDS THE ADMIN COMMAND TO THE API
// export const sendAdminCommand = async (inputParams) => {
//   const { apiURL } = CONFIG;
//   try {
//     const res = await axios.post(apiURL, inputParams);

//     return res.data;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// };

//SENDS THE ADMIN COMMAND TO THE API
export const sendAdminCommand = async (inputParams, onUpdate) => {
  const { apiStartURL, apiStreamURL } = CONFIG;
  try {
    await axios.post(apiStartURL, inputParams);

    const eventSource = new EventSource(apiStreamURL);

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      onUpdate(data);
    };

    return { eventSource };
  } catch (error) {
    console.log(error);
    return null;
  }
};
