import axios from "axios";
import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";

export const runAdminSubmit = async (inputParams) => {
  const apiData = await sendAdminCommand(inputParams);
  console.log("API DATA", apiData);
  return apiData;
};

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

//gets admin backend data
export const runGetAdminBackendData = async (inputObj) => {
  const { scrapeId, isFirstLoad } = inputObj;

  console.log("RUN GET ADMIN BACKEND DATA");
  console.log(inputObj);

  //get ALL DATA FIRST
  if (isFirstLoad) {
    const defaultLogObj = await getDefaultLogObj();
    const defaultReturnObj = { ...inputObj };
    defaultReturnObj.defaultLogObj = defaultLogObj;

    return defaultReturnObj;
  }

  // const returnObj = {};
  // const allDataObj = {};
  // for (let i = 0; i < logArr.length; i++) {
  //   const allItem = logArr[i];
  //   const allModel = new dbModel("", CONFIG[allItem]);
  //   const allArray = await allModel.getAll();
  //   allDataObj[allItem] = allArray?.length || 0;
  // }
  // returnObj.allDataObj = allDataObj;

  // //add is first load / scrapeId
  // returnObj.isFirstLoad = isFirstLoad;
  // returnObj.scrapeId = scrapeId;

  // //return if no scrapeId (bc first load)
  // if (isFirstLoad) return returnObj;

  // console.log("INPUT OBJ!!!");
  // console.log(inputObj);

  // const scrapeDataModel = new dbModel({ scrapeId: scrapeId }, "log");
  // const scrapeDataObj = await scrapeDataModel.getScrapeData();

  // console.log("SCRAPE DATA ARRAY");
  // console.log(scrapeDataObj);

  // returnObj.scrapeDataObj = scrapeDataObj;

  // return returnObj;
};

//default log from mongodb
export const getDefaultLogObj = async () => {
  const { logArr } = CONFIG;

  const defaultLogObj = {};
  for (let i = 0; i < logArr.length; i++) {
    const allItem = logArr[i];
    const allModel = new dbModel("", CONFIG[allItem]);
    const allArray = await allModel.getAll();
    defaultLogObj[allItem] = allArray?.length || 0;
  }

  return defaultLogObj;
};
