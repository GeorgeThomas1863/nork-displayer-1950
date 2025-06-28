import CONFIG from "../config/config.js";
import { getParamsMap } from "../config/map-display.js";
import dbModel from "../models/db-model.js";
import { removeInvalidItems, fixDataByType } from "./src-fix.js";

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
  //OLD 5 way array
  // const typeArr = CONFIG.backendTypeArr;
  const { typeArr } = CONFIG;

  const defaultDataArray = [];
  for (let i = 0; i < typeArr.length; i++) {
    const dataType = typeArr[i];
    const dataParams = await getParamsMap(dataType);
    const { collection, howMany } = dataParams;

    // update how many (to account for fucked items)
    const howManyBuffer = Math.ceil(+howMany * 1.5);
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

    console.log(dataType);
    console.log(dataArrayFixed.length);

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
  const { dataType, dataReq, dataLoaded } = inputObj;
  const { articleType } = dataReq;

  // console.log("GET BACKEND DATA NEW");
  // console.dir(inputObj);

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

  //FIX ARTICLES HERE

  const dataModel = new dbModel(params, collection);
  const isArticleFilter = dataType === "articles" && articleType !== "all-type";

  const sortPrefix = sortByInput.includes("newest-to-oldest") ? "Newest" : "Oldest";
  const typeSuffix = isArticleFilter ? "sByType" : "s";
  const methodName = `get${sortPrefix}Item${typeSuffix}Array`;

  const dataArrayRaw = await dataModel[methodName]();
  const dataArrayValid = await removeInvalidItems(dataArrayRaw, dataType, howManyInput);
  const dataArrayFixed = await fixDataByType(dataArrayValid, dataType);

  console.log(dataType);
  console.log(dataArrayFixed.length);

  const dataObj = {
    dataType: dataType,
    dataArray: dataArrayFixed,
  };

  //return as array to match default
  const dataArray = [dataObj];

  // console.log("NEW DATA ARRAY");
  // console.dir(dataArray);

  return dataArray;
};

//------------------------
