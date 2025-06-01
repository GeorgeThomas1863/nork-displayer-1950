import fs from "fs";
import CONFIG from "../config/config.js";
import { articleTypeMap, backendDefaultParams } from "../config/map-display.js";
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
    // params.dataType = dataType;
  } else {
    //use input
    params = { ...inputObj };
  }

  const dataModel = new dbModel(params, collection);
  const dataArrayRaw = await dataModel.getNewestItemsArray();
  const dataArray = await fixDataByType(dataArrayRaw, dataType);

  dataObj[dataType] = dataArray;

  console.log("DATA RETURN LENGTHS");
  console.log("Articles: " + dataObj.articles.length);
  console.log("Pics: " + dataObj.pics.length);
  console.log("Pic Sets: " + dataObj.picSets.length);
  console.log("Vids: " + dataObj.vids.length);
  console.log("Vid Pages: " + dataObj.vidPages.length);

  return dataObj;
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

      //DONT GIVE A SHIT ABOUT BELOW, DONT NEED IT
      //need to derive the fucking thumbnail
      // const { url } = inputObj;
      // const { vidPageContent } = CONFIG;

      // const thumbnailModel = new dbModel({ keyToLookup: "vidURL", itemValue: url }, vidPageContent);
      // const vidObj = await thumbnailModel.getUniqueItem();
      // if (!vidObj || !vidObj.thumbnail) continue;

      // const { thumbnail } = vidObj;
      // // console.log("INPUT OBJ");
      // // console.log(inputObj);

      // const thumbnailObj = await getPicData(thumbnail);
      // if (!thumbnailObj) continue;

      // // console.log("THUMBNAIL OBJ");
      // // console.log(thumbnailObj);

      // const returnObj = { ...inputObj, ...thumbnailObj };
      // returnObj.savePath = inputObj.savePath;
      // returnObj.picSavePath = thumbnailObj.savePath;

      // results.push(returnObj);
      // break;

      //NEED TO ADD PIC SETS / VID PAGES!!!
      // default:
      //   return inputArray;
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

export const getNewArticleData = async (inputParams) => {
  if (!inputParams || !inputParams.articleType || !inputParams.articleHowMany || !inputParams.articleSortBy) return null;
  const { articleType, articleHowMany, articleSortBy } = inputParams;
  const { articles } = CONFIG;

  const articleParams = {
    sortKey: "articleId",
    howMany: articleHowMany,
    filterKey: "articleType",
    filterValue: articleType,
  };

  const articleModel = new dbModel(articleParams, articles);

  //if all DONT filter by type
  let articleArrayRaw = [];
  if (articleType === "all-type") {
    switch (articleSortBy) {
      case "article-newest-to-oldest":
        articleArrayRaw = await articleModel.getNewestItemsArray();
        break;

      case "article-oldest-to-newest":
        articleArrayRaw = await articleModel.getOldestItemsArray();
        break;
    }
  } else {
    //otherwise filter by type
    switch (articleSortBy) {
      case "article-newest-to-oldest":
        articleArrayRaw = await articleModel.getNewestItemsByTypeArray();
        break;

      case "article-oldest-to-newest":
        articleArrayRaw = await articleModel.getOldestItemsByTypeArray();
        break;
    }
  }

  const articleArray = await fixDataByType(articleArrayRaw, "articles");
  return articleArray;
};

export const getNewPicData = async (inputParams) => {
  if (!inputParams || !inputParams.picType || !inputParams.picHowMany || !inputParams.picSortBy) return null;
  const { picType, picHowMany, picSortBy } = inputParams;
  const { picsDownloaded, picSetContent } = CONFIG;

  const picParams = {
    sortKey: "picId",
    howMany: picHowMany,
  };

  //SEPARATE HERE BY PIC TYPE
  let collection = "";
  switch (picType) {
    case "pic-alone":
      collection = picsDownloaded;
      break;

    case "pic-sets":
      collection = picSetContent;
      break;
  }

  const picModel = new dbModel(picParams, collection);

  //if all DONT filter by type
  let picArrayRaw = [];
  switch (picSortBy) {
    case "pic-newest-to-oldest":
      picArrayRaw = await picModel.getNewestItemsArray();
      break;

    case "pic-oldest-to-newest":
      picArrayRaw = await picModel.getOldestItemsArray();
      break;
  }

  if (picType === "pic-sets") {
    const picSetArray = await fixDataByType(picArrayRaw, "picSets");
    return picSetArray;
  }

  //otherwise pic alone
  const picArray = await fixDataByType(picArrayRaw, "pics");

  return picArray;
};

export const getNewVidData = async (inputParams) => {
  if (!inputParams || !inputParams.vidType || !inputParams.vidHowMany || !inputParams.vidSortBy) return null;
  const { vidType, vidHowMany, vidSortBy } = inputParams;
  const { vidsDownloaded, vidPageContent } = CONFIG;

  const vidParams = {
    sortKey: "vidId",
    howMany: vidHowMany,
  };

  let collection = "";
  switch (vidType) {
    case "vid-alone":
      collection = vidsDownloaded;
      break;

    case "vid-pages":
      collection = vidPageContent;
      break;
  }

  const vidModel = new dbModel(vidParams, collection);

  let vidArrayRaw = [];
  switch (vidSortBy) {
    case "vid-newest-to-oldest":
      vidArrayRaw = await vidModel.getNewestItemsArray();
      break;

    case "vid-oldest-to-newest":
      vidArrayRaw = await vidModel.getOldestItemsArray();
      break;
  }

  if (vidType === "vid-pages") {
    const vidArrayPicRaw = await fixDataByType(vidArrayRaw, "vidPages");
    const vidPageArray = await fixVidDataArray(vidArrayPicRaw);
    return vidPageArray;
  }

  //otherwise vid alone, just return raw (fixing doesnt do anything)
  const vidArray = vidArrayRaw;
  return vidArray;
};
