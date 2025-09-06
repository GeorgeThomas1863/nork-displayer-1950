import axios from "axios";
import CONFIG_PUBLIC from "../../config/config-public.js";

export const sendScrapeCommand = async (params) => {
  console.log("PARAMS");
  console.dir(params);
  
  console.log("CONFIG PUBLIC");
  console.dir(CONFIG_PUBLIC);
};
