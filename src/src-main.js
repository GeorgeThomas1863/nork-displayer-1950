import { backendDefaultParams } from "../config/map-display.js";
import { getValidDataArray } from "./src-get.js";
import { checkDataType } from "./src-check.js";
import { fixInputDefaults, fixDataByType } from "./src-fix.js";

//gets backend data from db
export const runGetBackendData = async (inputObj) => {
  if (!inputObj || !inputObj.dataType) return null;
  const { dataType, isFirstLoad } = inputObj;
  const dataObj = {};

  const collection = backendDefaultParams[dataType].collection;

  let params = {};
  if (isFirstLoad) {
    //set to default
    params = backendDefaultParams[dataType];
  } else {
    //use input
    params = await fixInputDefaults(inputObj);
  }

  //checks if items EXIST, only returns those that do
  const dataArrayRaw = await getValidDataArray(params, dataType, collection);

  const dataArray = await fixDataByType(dataArrayRaw, dataType);

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
