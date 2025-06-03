import fs from "fs";
import CONFIG from "../config/config.js";
import { articleTypeMap, backendDefaultParams, clickIdTriggerMap, expandTriggerMap } from "../config/map-display.js";
import dbModel from "../models/db-model.js";

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
        dataArrayRaw = await articleDataModel.getOldestItemsByTypeArrays();
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

export const fixInputDefaults = async (inputObj) => {
  const { dataType, howMany } = inputObj;
  const { articlesHowMany, picsHowMany, vidsHowMany } = CONFIG;
  const returnObj = { ...inputObj };

  if (howMany) return returnObj;

  let returnHowMany = 0;
  switch (dataType) {
    case "articles":
      returnHowMany = articlesHowMany;
      break;

    case "pics":
      returnHowMany = picsHowMany;
      break;

    case "vids":
      returnHowMany = vidsHowMany;
      break;
  }

  returnObj.howMany = returnHowMany;
  return returnObj;
};

//ADD IN PIC SETS AND VID PAGES
export const fixDataByType = async (inputArray, dataType) => {
  if (!inputArray) return null;

  const results = [];
  for (let i = 0; i < inputArray.length; i++) {
    const inputObj = inputArray[i];

    switch (dataType) {
      //single pics
      case "pics":
        const picURL = inputObj.url;
        const picDataObj = await getPicData(picURL);
        if (!picDataObj) continue;

        const picObj = { ...picDataObj, ...inputObj };

        results.push(picObj);
        break;

      //picArray
      case "articles":
      case "picSets":
        //rebuild pic array (returns INPUTOBJ if no picArray)
        const picArrayObj = await fixPicArray(inputObj);
        if (!picArrayObj) continue;

        results.push(picArrayObj);
        break;

      //pics as thumbnails
      case "vidPages":
        //return input
        const vidDataObj = await fixVidDataArray(inputObj);
        if (!vidDataObj) continue;

        const vidObj = { ...vidDataObj, ...inputObj };
        results.push(vidObj);
        break;

      //might need to fix thumbnail (prob not)
      case "vids":
        results.push(inputObj);
        break;
    }
  }

  return results;
};

//rebuild the picArray
export const fixPicArray = async (inputObj) => {
  if (!inputObj || !inputObj.picArray || !inputObj.picArray.length) return inputObj;
  const { picArray } = inputObj;
  const returnObj = { ...inputObj };

  const picDataArray = [];
  for (let i = 0; i < picArray.length; i++) {
    //gets pic data AND source / date
    const picDataObj = await getPicData(picArray[i]);
    if (!picDataObj) continue;

    picDataArray.push(picDataObj);
  }

  returnObj.picArray = picDataArray;
  return returnObj;
};

//get pic data (AND source / date)
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

const fixVidDataArray = async (inputArray) => {
  const results = [];
  for (let i = 0; i < inputArray.length; i++) {
    //only one vid so dont need to parse out array (like in pics)
    const vidObj = await getVidData(inputArray[i].url);
    results.push(vidObj);
  }

  return results;
};

const getVidData = async (vidURL) => {
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

//-----------------------------------

// GET NEW DATA SECTION
export const runGetNewData = async (inputObj) => {
  if (!inputObj) return null;
  const { articleHowMany, picHowMany, vidHowMany, articleType, articleSortBy, picSortBy, vidSortBy } = inputObj;

  //get data type
  const dataType = await getDataType(inputObj);
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

  // console.log("NEW DATA OBJ");
  // console.log(newDataObj);

  return newDataObj;
};

export const getDataType = async (inputObj) => {
  if (!inputObj) return null;

  const expandTypeCheck = await checkExpandType(inputObj);
  if (expandTypeCheck) return expandTypeCheck;

  const clickIdCheck = await checkClickId(inputObj);
  if (clickIdCheck) return clickIdCheck;

  return null;
};

export const checkExpandType = async (inputObj) => {
  if (!inputObj || !inputObj.expandType) return null;
  const { expandType, picType, vidType } = inputObj;

  console.log("INPUT OBJ");
  console.log(inputObj);

  const expandTrigger = expandTriggerMap[expandType];

  console.log("EXPAND TRIGGER");
  console.log(expandTrigger);

  switch (expandTrigger) {
    case "articles":
      return "articles";

    case "pics":
      if (picType === "pic-alone") {
        return "pics";
      } else {
        return "picSets";
      }

    case "vids":
      if (vidType === "vid-alone") {
        return "vids";
      } else {
        return "vidPages";
      }
  }

  return null;
};

export const checkClickId = async (inputObj) => {
  if (!inputObj || !inputObj.clickId) return null;
  const { clickId } = inputObj;

  //loop
  for (const k in clickIdTriggerMap) {
    const trigger = clickIdTriggerMap[k];
    if (trigger.includes(clickId)) {
      return k;
    }
  }

  return null;
};
