import CONFIG from "../config/config.js";
import { getBackendDefaultParams } from "../config/map-display.js";
import dbModel from "../models/db-model.js";
// import { getBackendParams } from "./src-get.js";
// import { checkDataType } from "./src-check.js";
import { fixDataByType, removeInvalidItems } from "./src-fix.js";

//gets backend data from db
export const runGetBackendData = async (inputObj) => {
  if (!inputObj || !inputObj.dataType) return null;
  const { isFirstLoad } = inputObj;

  switch (isFirstLoad) {
    case true:
      return await getBackendDataDefault();

    case false:
      return await getBackendDataNew(inputObj);
  }
};

//get default data with loop through types
export const getBackendDataDefault = async () => {
  const typeArr = CONFIG.backendTypeArr;

  const defaultDataArray = [];
  for (let i = 0; i < typeArr.length; i++) {
    const dataType = typeArr[i];
    const dataParams = await getBackendDefaultParams(dataType);
    const { collection, howMany } = dataParams;

    // update how many (to account for fucked items)
    const howManyBuffer = Math.ceil(+howMany * 1.2);
    dataParams.howMany = howManyBuffer;

    const dataModel = new dbModel(dataParams, collection);

    let dataArrayRaw = "";
    if (dataType === "articles") {
      dataArrayRaw = await dataModel.getNewestItemsByTypeArray();
    } else {
      dataArrayRaw = await dataModel.getNewestItemsArray();
    }

    const dataArrayValid = await removeInvalidItems(dataArrayRaw, dataType, howMany);
    const dataArrayFixed = await fixDataByType(dataArrayValid, dataType);

    if (dataType === "vidPages") {
      console.log("AHHHHHHHHHHHHHHH");
      console.log(dataArrayFixed);
    }

    const dataObj = {
      dataType: dataType,
      dataArray: dataArrayFixed,
    };

    defaultDataArray.push(dataObj);
  }

  // console.log("DEFAULT DATA ARRAY");
  // console.dir(defaultDataArray);

  return defaultDataArray;
};

//--------------------------------

export const getBackendDataNew = async (inputObj) => {
  const { dataType, dataReq, dataLoaded, isFirstLoad } = inputObj;

  console.log("INPUT OBJ");
  console.dir(inputObj);

  const params = await getBackendDefaultParams(dataType);
  const { collection } = params;

  //get the type key
  let typeKey = "";
  if (dataType === "picSets" || dataType === "vidPages") {
    typeKey = dataType.substring(0, 3);
  } else {
    typeKey = dataType.substring(0, dataType.length - 1);
  }

  console.log("DATA LOADED");
  console.log(dataLoaded[dataType]);

  const sortByInput = dataReq[`${typeKey}SortBy`];
  const howManyInput = dataReq[`${typeKey}HowMany`] || dataLoaded[dataType];
  const howManyBuffer = Math.ceil(+howManyInput * 1.2);

  params.sortBy = sortByInput;
  params.howMany = howManyBuffer;

  //FIX ARTICLES HERE

  const dataModel = new dbModel(params, collection);
  // const isArticleFilter = dataType === "articles" && filterValue !== "all-type";
  // const typeSuffix = isArticleFilter ? "sByType" : "s";
  // const methodName = `get${sortPrefix}Item${typeSuffix}Array`;

  const sortPrefix = sortByInput === "newest-to-oldest" ? "Newest" : "Oldest";
  const methodName = `get${sortPrefix}ItemsArray`;

  const dataArrayRaw = await dataModel[methodName]();

  const dataArrayValid = await removeInvalidItems(dataArrayRaw, dataType, howManyInput);
  const dataArrayFixed = await fixDataByType(dataArrayValid, dataType);

  const dataObj = {
    dataType: dataType,
    dataArray: dataArrayFixed,
  };

  //return as array to match default
  const dataArray = [dataObj];

  console.log("NEW DATA ARRAY");
  console.dir(dataArray);

  return dataArray;
};
