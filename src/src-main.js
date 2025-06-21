import CONFIG from "../config/config.js";
import { getBackendDefaultParams } from "../config/map-display.js";
import dbModel from "../models/db-model.js";
// import { getBackendParams } from "./src-get.js";
// import { checkDataType } from "./src-check.js";
import { fixDataByType, removeInvalidItems } from "./src-fix.js";

//gets backend data from db
export const runGetBackendData = async (inputObj) => {
  if (!inputObj || !inputObj.isFirstLoad || !inputObj.dataType) return null;
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

    const dataObj = {
      dataType: dataType,
      dataArray: dataArrayFixed,
    };

    defaultDataArray.push(dataObj);
  }

  console.log("DEFAULT DATA ARRAY");
  console.dir(defaultDataArray);

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

  console.log("NEW DATA PARAMS");
  console.dir(params);

  // console.log("SORT BY INPUT");
  // console.log(sortByInput);

  // console.log("HOW MANY INPUT");
  // console.log(howManyInput);

  // console.log("PARAMS");
  // console.log(params);

  //GET ARTICLE TYPE HERE

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

  console.log("NEW DATA OBJ");
  console.dir(dataObj);

  return dataObj;
};

// if (isFirstLoad) {
//   const defaultData =
//   // console.log("DEFAULT DATA BACKEND");
//   // console.log(defaultData);
//   return defaultData;
// }

// params.sortBy = sortByInput;

// console.log("INPUT OBJ");
// console.dir(inputObj);s

// console.log("PARAMS");
// console.dir(params);

// //build backend params based on if first load
// const backendParams = await getBackendParams(inputObj);
// const { sortBy, filterValue, howMany } = backendParams;

// // update how many (to account for fucked items)
//
// backendParams.howMany = howManyBuffer;

// //CLAUDE's VERSION OF MY SHITTY CODE to lookup data
// const dataModel = new dbModel(backendParams, collection);
// const isArticleFilter = dataType === "articles" && filterValue !== "all-type";

// const sortPrefix = sortBy === "newest-to-oldest" ? "Newest" : "Oldest";
// const typeSuffix = isArticleFilter ? "sByType" : "s";
// const methodName = `get${sortPrefix}Item${typeSuffix}Array`;

// const dataArrayRaw = await dataModel[methodName]();

// const dataArrayFixed = await fixDataByType(dataArrayRaw, dataType);
// const dataArray = await removeInvalidItems(dataArrayFixed, dataType, howMany);

// dataObj[dataType] = dataArray;
// dataObj.dataType = dataType;

// if (dataObj) {
//   const typeStr = dataType.toUpperCase();
//   console.log(`GOT ${dataObj[dataType].length} ${typeStr}`);
// }

// return dataObj;
// };

// GET NEW DATA SECTION
// export const runGetNewData = async (inputObj) => {
//   if (!inputObj) return null;
//   const { articleHowMany, picHowMany, vidHowMany, articleType, articleSortBy, picSortBy, vidSortBy } = inputObj;

//   //get data type
//   const dataType = await checkDataType(inputObj);
//   if (!dataType) return null;

//   //get params
//   const defaultParams = await getBackendDefaultParams(dataType);
//   const sortKey = defaultParams.sortKey;
//   const sortKey2 = defaultParams.sortKey2;

//   let sortByRaw = "";
//   let howMany = 0;
//   switch (dataType) {
//     case "articles":
//       howMany = articleHowMany;
//       sortByRaw = articleSortBy;
//       break;

//     case "pics":
//     case "picSets":
//       howMany = picHowMany;
//       sortByRaw = picSortBy;
//       break;

//     case "vids":
//     case "vidPages":
//       howMany = vidHowMany;
//       sortByRaw = vidSortBy;
//       break;
//   }

//   const paramsObj = {
//     isFirstLoad: false,
//     dataType: dataType,
//     sortKey: sortKey,
//     sortKey2: sortKey2,
//     howMany: howMany,
//     sortBy: sortByRaw.substring(sortByRaw.indexOf("-") + 1),
//     filterKey: "articleType",
//     filterValue: articleType,
//   };

//   const newDataObj = await runGetBackendData(paramsObj);

//   return newDataObj;
// };
