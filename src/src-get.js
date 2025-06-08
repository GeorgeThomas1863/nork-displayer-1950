import fs from "fs";
import CONFIG from "../config/config.js";
import { articleTypeMap } from "../config/map-display.js";
import dbModel from "../models/db-model.js";

//CLAUDE LOOKUP FUNCTION FOR ENSURING SHIT VALID (incredibly inefficient method, dont care)
export const getValidDataArray = async (inputParams, dataType, collection) => {
  if (!inputParams || !inputParams.howMany || !dataType || !collection) return null;

  const { sortBy, sortKey, howMany, filterValue, filterKey } = inputParams;
  const howManyBuffer = Math.ceil(howMany * 1.5);

  const lookupParams = {
    sortKey: sortKey,
    howMany: howManyBuffer,
    filterKey: filterKey,
    filterValue: filterValue,
  };

  //CLAUDE's VERSION OF MY SHITTY CODE
  const dataModel = new dbModel(lookupParams, collection);
  const isArticleFilter = dataType === "articles" && filterValue !== "all-type";

  const sortPrefix = sortBy === "newest-to-oldest" ? "Newest" : "Oldest";
  const typeSuffix = isArticleFilter ? "sByType" : "s";
  const methodName = `get${sortPrefix}Item${typeSuffix}Array`;

  const dataArrayRaw = await dataModel[methodName]();
  //END OF CLAUDE VERSION

  const dataReturnArray = [];
  for (let i = 0; i < dataArrayRaw.length; i++) {
    const dataObj = dataArrayRaw[i];
    const { savePath } = dataObj;

    //if it doesnt exist skip it
    if (!fs.existsSync(savePath)) {
      console.log("AHHHHHHHHHHHHHHHHHH");
      console.log(`${savePath} does not exist`);
      continue;
    }

    dataReturnArray.push(dataObj);
    if (dataReturnArray.length === howMany) {
      return dataReturnArray;
    }
  }

  return dataReturnArray;

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
};

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
      picSource = picSource + ` and Pic Set Titled <i>${title}</i>`;
    }

    if (!picDate) {
      picDate = date;
    }
  }

  //check vid pages
  const vidPageModel = new dbModel({ keyToLookup: "thumbnail", itemValue: picURL }, vidPageContent);
  const vidPageObj = await vidPageModel.getUniqueItem();
  if (vidPageObj) {
    const { title, date } = vidPageObj;

    if (!picSource) {
      picSource = `Vid Page Titled ${title}`;
    } else {
      picSource = picSource + ` and Vid Page Titled <i>${title}</i>`;
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

//GET VID DATA
export const getVidData = async (vidURL) => {
  const { vidsDownloaded } = CONFIG;

  const lookupParams = {
    keyToLookup: "url",
    itemValue: vidURL,
  };

  const vidDataModel = new dbModel(lookupParams, vidsDownloaded);
  const vidObj = await vidDataModel.getUniqueItem();

  //   console.log("VID OBJ");
  //   console.log(vidObj);

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
