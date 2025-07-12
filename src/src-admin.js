import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";
import { sendAdminCommand, sendKcnaWatchCommand } from "./api-back.js";

//gets admin backend data
// export const runGetDefaultDataAdmin = async (inputObj) => {
export const runGetAdminBackendData = async (inputObj) => {
  const { dataReq, isFirstLoad } = inputObj;
  const { appType } = dataReq;

  const firstLoadObj = { ...inputObj };

  const logObj = await getDefaultLogObj();
  firstLoadObj.logObj = logObj;

  if (isFirstLoad) return firstLoadObj;

  let dataObj = {};
  switch (appType) {
    case "admin-scraper":
      dataObj = await sendAdminCommand(dataReq);
      break;
    case "admin-kcna-watch":
      dataObj = await sendKcnaWatchCommand(dataReq);
      break;
  }
  if (!dataObj) return firstLoadObj;

  const returnObj = { ...firstLoadObj, ...dataObj };

  return returnObj;
};

//default log from mongodb
export const getDefaultLogObj = async () => {
  const { logArr } = CONFIG;

  //sort logArr alphabetically a-z [so object is sorted by keys]
  const sortedLogArr = logArr.sort();

  const defaultLogObj = {};
  for (let i = 0; i < sortedLogArr.length; i++) {
    const allItem = sortedLogArr[i];
    const allModel = new dbModel("", CONFIG[allItem]);
    const allArray = await allModel.getAll();
    defaultLogObj[allItem] = allArray?.length || 0;
  }

  return defaultLogObj;
};
