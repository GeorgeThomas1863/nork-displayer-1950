import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";
import { sendAdminCommand, sendKcnaWatchCommand } from "./api-back.js";

//gets admin backend data
// export const runGetDefaultDataAdmin = async (inputObj) => {
export const runGetAdminBackendData = async (inputObj) => {
  const { dataReq, isFirstLoad } = inputObj;

  const firstLoadObj = { ...inputObj };

  const logObj = await getDefaultLogObj();
  firstLoadObj.logObj = logObj;

  if (isFirstLoad) return firstLoadObj;

  console.log("DATA REQ");
  console.log(dataReq);

  const sendKcnaWatchObj = await sendKcnaWatchCommand(dataReq);

  //RE ENABLE
  // const adminStartObj = await sendAdminCommand(dataReq);
  // if (!adminStartObj) return firstLoadObj;

  // const returnObj = { ...firstLoadObj, ...adminStartObj };

  // return returnObj;

  return sendKcnaWatchObj;
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
