import CONFIG from "../config/config.js";
import { getParamsMap } from "../config/map-display.js";
import dbModel from "../models/db-model.js";
import { removeInvalidItems } from "./src-fix.js";

//gets backend data from db
export const runGetBackendData = async (inputObj) => {
  //double check trigger doesnt fuck things here (spoiler, it did)
  if (!inputObj) return null;
  const { isFirstLoad } = inputObj;

  console.log("!!!INPUT OBJ");
  console.log(inputObj);

  switch (isFirstLoad) {
    case true:
      return await getBackendDataDefault();

    case false:
      return await getBackendDataNew(inputObj);
  }
};

//get default data with loop through types
export const getBackendDataDefault = async () => {
  //OLD 5 way array
  // const typeArr = CONFIG.backendTypeArr;
  const { typeArr } = CONFIG;

  const defaultDataArray = [];
  for (let i = 0; i < typeArr.length; i++) {
    const dataType = typeArr[i];
    const dataParams = await getParamsMap(dataType);
    const { collection, howMany } = dataParams;

    // console.log("!!!DATA PARAMS");
    // console.log(dataParams);

    // update how many (to account for fucked items)
    const howManyBuffer = Math.ceil(+howMany * 1.5);
    dataParams.howMany = howManyBuffer;

    const dataModel = new dbModel(dataParams, collection);

    let dataArrayRaw = "";
    if (dataType === "articles") {
      dataArrayRaw = await dataModel.getNewestItemsByTypeArray();
    } else {
      dataArrayRaw = await dataModel.getNewestItemsArray();
      // console.log("!!!dataArrayRaw");
      // console.log(dataArrayRaw);
    }

    const dataArrayValid = await removeInvalidItems(dataArrayRaw, dataType, howMany);

    console.log(dataType);
    console.log(dataArrayValid.length);

    const dataObj = {
      dataType: dataType,
      dataArray: dataArrayValid,
    };

    defaultDataArray.push(dataObj);
  }

  return defaultDataArray;
};

//--------------------------------

export const getBackendDataNew = async (inputObj) => {
  const { dataType, dataReq, dataLoaded, articleType } = inputObj;

  const params = await getParamsMap(dataType);
  const { collection } = params;

  //get the type key
  const typeKey = dataType.substring(0, dataType.length - 1);

  const sortByInput = dataReq[`${typeKey}SortBy`];
  const howManyInput = dataReq[`${typeKey}HowMany`] || dataLoaded[dataType];
  const howManyBuffer = Math.ceil(+howManyInput * 1.2);

  //update params based on input
  params.sortBy = sortByInput;
  params.howMany = howManyBuffer;
  params.filterValue = articleType;

  // console.log("!!!PARAMS");
  // console.log(params);

  const dataModel = new dbModel(params, collection);
  const isArticleFilter = dataType === "articles" && articleType !== "all-type";

  const sortPrefix = sortByInput.includes("newest-to-oldest") ? "Newest" : "Oldest";
  const typeSuffix = isArticleFilter ? "sByType" : "s";
  const methodName = `get${sortPrefix}Item${typeSuffix}Array`;

  const dataArrayRaw = await dataModel[methodName]();
  console.log("!!!DATA ARRAY RAW");
  console.log(dataArrayRaw.length);

  const dataArrayValid = await removeInvalidItems(dataArrayRaw, dataType, howManyInput);
  if (!dataArrayValid) return null;

  //leave on for tracking
  console.log(dataType);
  console.log(dataArrayValid.length);

  const dataObj = {
    dataType: dataType,
    dataArray: dataArrayValid,
  };

  //return as array to match default
  const dataArray = [dataObj];

  return dataArray;
};

//------------------------
