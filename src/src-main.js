import { backendDefaultParams } from "../config/map-display.js";
import dbModel from "../models/db-model.js";
import { getBackendParams } from "./src-get.js";
import { checkDataType } from "./src-check.js";
import { fixDataByType, removeInvalidItems } from "./src-fix.js";

//gets backend data from db
export const runGetBackendData = async (inputObj) => {
  if (!inputObj || !inputObj.dataType) return null;
  const { dataType } = inputObj;
  const dataObj = {};

  console.log("INPUT OBJ");
  console.log(inputObj);

  const collection = backendDefaultParams[dataType].collection;

  //build backend params based on if first load
  const backendParams = await getBackendParams(inputObj);
  const { sortBy, filterValue } = backendParams;

  console.log("BACKEND PARAMS");
  console.log(backendParams);

  //update how many (to account for fucked items)
  // const howManyBuffer = Math.ceil(howMany * 1.5);
  // backendParams.howMany = howManyBuffer;

  //CLAUDE's VERSION OF MY SHITTY CODE to lookup data
  const dataModel = new dbModel(backendParams, collection);
  const isArticleFilter = dataType === "articles" && filterValue !== "all-type";

  const sortPrefix = sortBy === "newest-to-oldest" ? "Newest" : "Oldest";
  const typeSuffix = isArticleFilter ? "sByType" : "s";
  const methodName = `get${sortPrefix}Item${typeSuffix}Array`;

  console.log("METHOD NAME");
  console.log(methodName);

  const dataArrayRaw = await dataModel[methodName]();

  //checks if items EXIST, only returns those that do
  // const dataArrayRaw = await getValidDataArray(params, dataType, collection);

  const dataArrayFixed = await fixDataByType(dataArrayRaw, dataType);
  const dataArray = await removeInvalidItems(dataArrayFixed, dataType, howMany);

  dataObj[dataType] = dataArray;
  dataObj.dataType = dataType;

  // console.log("DATA OBJ");
  // console.log(dataObj);

  if (dataObj) {
    const typeStr = dataType.toUpperCase();
    console.log(`GOT ${dataObj[dataType].length} ${typeStr}`);
  }

  return dataObj;
};

//OLD WAY OF DOING LOOKUP (DELETE)
// let dataArrayRaw = [];
// if (dataType === "articles" && filterValue !== "all-type") {
//   const articleDataModel = new dbModel(lookupParams, collection);

//   switch (sortBy) {
//     case "newest-to-oldest":
//       dataArrayRaw = await articleDataModel.getNewestItemsByTypeArray();
//       break;

//     case "oldest-to-newest":
//       dataArrayRaw = await articleDataModel.getOldestItemsByTypeArray();
//       break;
//   }
// } else {
//   const otherDataModel = new dbModel(lookupParams, collection);

//   switch (sortBy) {
//     case "newest-to-oldest":
//       dataArrayRaw = await otherDataModel.getNewestItemsArray();
//       break;

//     case "oldest-to-newest":
//       dataArrayRaw = await otherDataModel.getOldestItemsArray();
//       break;
//   }
// }

// GET NEW DATA SECTION
export const runGetNewData = async (inputObj) => {
  if (!inputObj) return null;
  const { articleHowMany, picHowMany, vidHowMany, articleType, articleSortBy, picSortBy, vidSortBy } = inputObj;

  // console.log("RUN GET NEW DATA CALLED");
  // console.log(inputObj);

  //get data type
  const dataType = await checkDataType(inputObj);

  // console.log("DATA TYPE");
  // console.log(dataType);

  if (!dataType) return null;

  //get params
  const sortKey = backendDefaultParams[dataType].sortKey;

  let sortByRaw = "";
  let howMany = 0;
  switch (dataType) {
    case "articles":
      howMany = articleHowMany;
      sortByRaw = articleSortBy;
      break;

    case "pics":
    case "picSets":
      howMany = picHowMany;
      sortByRaw = picSortBy;
      break;

    case "vids":
    case "vidPages":
      howMany = vidHowMany;
      sortByRaw = vidSortBy;
      break;
  }

  const paramsObj = {
    isFirstLoad: false,
    dataType: dataType,
    sortKey: sortKey,
    howMany: howMany,
    sortBy: sortByRaw.substring(sortByRaw.indexOf("-") + 1),
    filterKey: "articleType",
    filterValue: articleType,
  };

  // console.log("PARAMS OBJ");
  // console.log(paramsObj);

  const newDataObj = await runGetBackendData(paramsObj);

  return newDataObj;
};
