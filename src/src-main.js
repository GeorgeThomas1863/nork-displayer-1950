import fs from "fs";
import CONFIG from "../config/config.js";
import { articleTypeMap, backendDefaultParams } from "../config/map-display.js";
import dbModel from "../models/db-model.js";
import { fixInputDefaults, fixDataByType, checkDataType } from "./src-util.js";

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

  // console.log("RUN GET BACKEND DATA PARAMS");
  // console.log(params);

  //handle articles
  let dataArrayRaw = [];
  const { sortBy } = params;
  if (dataType === "articles") {
    const articleDataModel = new dbModel(params, collection);

    switch (sortBy) {
      case "newest-to-oldest":
        dataArrayRaw = await articleDataModel.getNewestItemsByTypeArray();
        break;

      case "oldest-to-newest":
        dataArrayRaw = await articleDataModel.getOldestItemsByTypeArray();
        break;
    }
  } else {
    const otherDataModel = new dbModel(params, collection);

    switch (sortBy) {
      case "newest-to-oldest":
        dataArrayRaw = await otherDataModel.getNewestItemsArray();
        break;

      case "oldest-to-newest":
        dataArrayRaw = await otherDataModel.getOldestItemsArray();
        break;
    }
  }

  const dataArray = await fixDataByType(dataArrayRaw, dataType);

  dataObj[dataType] = dataArray;
  dataObj.dataType = dataType;

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

  console.log("RUN GET NEW DATA CALLED");
  console.log(inputObj);

  //get data type
  const dataType = await checkDataType(inputObj);
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

  const newDataObj = await runGetBackendData(paramsObj);

  return newDataObj;
};

//-------------------------

//GET PIC DATA SECTION
export const getPicData = async (picURL) => {
  if (!picURL) return null;

  const dataParams = {
    keyToLookup: "url",
    itemValue: picURL,
  };

  try {
    //GET PIC DATA OBJ FROM DOWNLOAD COLLECTION
    const picDataObj = await getPicExtraData(dataParams);
    //FIND PIC SOURCE DATA
    const picSourceObj = await getPicSourceData(picURL);
    const returnObj = { ...picDataObj, ...picSourceObj };

    return returnObj;
  } catch (e) {
    console.log(e.message + "; PICURL: " + e.url + "; SAVE PATH: " + e.savePath);
    return null;
  }
};

export const getPicExtraData = async (params) => {
  const { picsDownloaded } = CONFIG;
  const picDataModel = new dbModel(params, picsDownloaded);
  const picDataObj = await picDataModel.getUniqueItem();

  if (!picDataObj || !picDataObj.savePath) return null;
  const { savePath } = picDataObj;

  //THROW ERROR IF PIC NOT DOWNLOADED
  if (!fs.existsSync(savePath)) {
    const error = new Error("PIC NOT DOWNLOADED");
    error.url = picURL;
    error.savePath = savePath;
    throw error;
  }

  return picDataObj;
};

//FIND WHERE PIC IS FROM
export const getPicSourceData = async (picURL) => {
  if (!picURL) return null;

  const { articles, picSetContent, vidPageContent } = CONFIG;
  let picSource = "";
  let picDate = "";

  //check articles
  const articleModel = new dbModel({ keyToLookup: "picArray", itemValue: picURL }, articles);
  const articleObj = await articleModel.getUniqueItem();

  //extract type
  if (articleObj) {
    const { title, articleType, date } = articleObj;

    //MAP ARTICLE TYPE HERE!!!
    const articleTypeText = articleTypeMap[articleType];
    picSource = `${articleTypeText} Article, Titled: <i>${title}</i>`;
    picDate = date;
  }

  //check pic sets
  const picSetModel = new dbModel({ keyToLookup: "picArray", itemValue: picURL }, picSetContent);
  const picSetObj = await picSetModel.getUniqueItem();
  if (picSetObj) {
    const { title, date } = picSetObj;

    if (!picSource) {
      picSource = `Pic Set Titled ${title}`;
    } else {
      picSource = picSource + ` and Pic Set Titled ${title}`;
    }

    if (!picDate) {
      picDate = date;
    }
  }

  //check vid pages
  const vidPageModel = new dbModel({ keyToLookup: "picArray", itemValue: picURL }, vidPageContent);
  const vidPageObj = await vidPageModel.getUniqueItem();
  if (vidPageObj) {
    const { title, date } = vidPageObj;

    if (!picSource) {
      picSource = `Vid Page Titled ${title}`;
    } else {
      picSource = picSource + ` and Vid Page Titled ${title}`;
    }

    if (!picDate) {
      picDate = date;
    }
  }

  const returnObj = {
    picSource: picSource,
    picDate: picDate,
  };

  return returnObj;
};

//---------------------------

//GET VID DATA SECTION
export const getVidData = async (vidURL) => {
  const { vidsDownloaded } = CONFIG;

  const lookupParams = {
    keyToLookup: "url",
    itemValue: vidURL,
  };

  const vidDataModel = new dbModel(lookupParams, vidsDownloaded);
  const vidObj = await vidDataModel.getUniqueItem();

  //checks if pic exists, return null if it doesnt
  if (!vidObj || !vidObj.savePath) return null;
  const { savePath } = vidObj;

  if (!fs.existsSync(savePath)) {
    const error = new Error("VID NOT DOWNLOADED");
    error.url = vidURL;
    error.savePath = savePath;
    throw error;
  }

  return vidObj;
};
