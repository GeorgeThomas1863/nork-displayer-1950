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
  const { logArr } = CONFIG;

  //get ALL DATA FIRST
  const returnObj = {};
  const allDataObj = {};
  for (let i = 0; i < logArr.length; i++) {
    const allItem = logArr[i];
    const allModel = new dbModel("", CONFIG[allItem]);
    const allArray = await allModel.getAll();
    allDataObj[allItem] = allArray?.length || 0;
  }
  returnObj.allDataObj = allDataObj;

  //return if no scrapeId (bc first load)
  if (isFirstLoad) return returnObj;

  console.log("INPUT OBJ!!!");
  console.log(inputObj);

  //GET SPECIFIC FROM LOG COLLECTION
  const params = {
    keyToLookup: "scrapeId",
    itemValue: scrapeId,
  };

  const scrapeDataModel = new dbModel(params, "log");
  const scrapeDataArray = await scrapeDataModel.getUniqueArray();

  console.log("SCRAPE DATA ARRAY");
  console.log(scrapeDataArray);

  returnObj.scrapeDataObj = scrapeDataArray[0];

  return returnObj;
};

// let params = "";
// if (isFirstLoad) {

// }

//ENABLE BELOW LATER
//GET SCRAPE STATS FROM MONGO [USE SAME LOOP METHOD]
// export const getStatsArray = async (scrapeId) => {
//     const { logArr } = CONFIG;

//     const scrapeStatsObj = {
//       keyToLookup: "scrapeId",
//       itemValue: scrapeId,
//     };

//     const statsArray = [];
//     for (let i = 0; i < logArr.length; i++) {
//       const logItem = logArr[i];

//       //get scrape stats
//       const scrapeStatsModel = new dbModel(scrapeStatsObj, CONFIG[logItem]);
//       const scrapeStatsArray = await scrapeStatsModel.getUniqueArray();

//       //get total stats (should work bc all collections are unique?) [!!DOUBLE CHECK THAT]
//       const totalStatsModel = new dbModel("", CONFIG[logItem]);
//       const totalStatsArray = await totalStatsModel.getAll();

//       //add to obj
//       const keyName = await getStatsKeyName(logItem);
//       const statsObj = {
//         scrapeItem: logItem,
//         keyName: keyName,
//         scrapeCount: scrapeStatsArray?.length || 0,
//         totalCount: totalStatsArray?.length || 0,
//       };

//       statsArray.push(statsObj);
//     }

//     return statsArray;
//   };

//   export const getStatsKeyName = async (inputItem) => {
//     //loop through map obj, return match
//     for (const k in keyMapObj) {
//       if (inputItem === k) return keyMapObj[k];
//     }

//     //otherwise return null
//     return null;
//   };
