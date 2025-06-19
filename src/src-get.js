import fs from "fs";
import CONFIG from "../config/config.js";
import { getBackendDefaultParams } from "../config/map-display.js";
import dbModel from "../models/db-model.js";
import { articleTypeMap } from "../config/map-display.js";
import { fixInputDefaults, fixDataByType, removeInvalidItems } from "./src-fix.js";

export const getBackendDataDefault = async () => {
  //get default shit
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

    console.log("DATA ARRAY VALID");
    console.log(dataType);
    console.log(dataArrayValid);

    const dataArrayFixed = await fixDataByType(dataArrayValid, dataType);
    // console.log("DATA ARRAY FIXED");
    // console.log(dataType);
    // console.log(dataArrayFixed);

    // console.log("DATA ARRAY");
    // console.log(dataType);
    // console.log(dataArray);

    const dataObj = {
      dataType: dataType,
      dataArray: dataArrayFixed,
    };

    defaultDataArray.push(dataObj);
  }

  return defaultDataArray;
};

//-------------------------------

export const getBackendParams = async (inputObj) => {
  if (!inputObj || !inputObj.dataType) return null;
  const { isFirstLoad, dataType } = inputObj;

  //set to default on first load
  if (isFirstLoad) {
    const defaultParams = await getBackendDefaultParams(dataType);
    return defaultParams;
  }

  //otherwise use input
  return await fixInputDefaults(inputObj);
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
    console.log(e.message + "; SAVE PATH: " + e.savePath + "; PICURL: " + e.url);
    return null;
  }
};

export const getPicExtraData = async (params) => {
  const { picsDownloaded } = CONFIG;
  const picDataModel = new dbModel(params, picsDownloaded);
  const picDataObj = await picDataModel.getUniqueItem();

  if (!picDataObj || !picDataObj.savePath) return null;
  const { url, savePath } = picDataObj;

  //THROW ERROR IF PIC NOT DOWNLOADED
  if (!fs.existsSync(savePath)) {
    const error = new Error("PIC NOT DOWNLOADED");
    error.url = url;
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
  console.log("GET VID DATA");
  console.log(vidURL);

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
  const { savePath, url } = vidObj;

  if (!fs.existsSync(savePath)) {
    const error = new Error("VID NOT DOWNLOADED");
    error.url = url;
    error.savePath = savePath;
    throw error;
  }

  return vidObj;
};

//-------------------------

//[half assed answer below, might need to do same for picSets / assumes prob is newest shit not downloaded]
//RE-GET / PULL DATA
export const rePullData = async (dataType, howMany) => {
  const { vidsDownloaded, vidPageContent } = CONFIG;

  switch (dataType) {
    case "vidPages":
      const vidParams = await getBackendDefaultParams("vids");
      vidParams.howMany = 1;

      const vidDataModel = new dbModel(vidParams, vidsDownloaded);
      const vidDataObj = await vidDataModel.getNewestItemsArray();
      if (!vidDataObj || !vidDataObj[0] || !vidDataObj[0].url) return null;
      const { url } = vidDataObj[0];

      const vidPageFindParams = {
        keyToLookup: "vidURL",
        itemValue: url,
      };

      //use url to get vid Page
      const vidPageFindModel = new dbModel(vidPageFindParams, vidPageContent);
      const vidPageObj = await vidPageFindModel.getUniqueItem();

      console.log("VID PAGE OBJ");
      console.log(vidPageObj);

    // return vidDataObj;
  }
};
