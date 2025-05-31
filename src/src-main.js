import fs from "fs";
import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";

//gets backend data from db
export const runGetBackendData = async () => {
  const { articles, picsDownloaded, vidsDownloaded } = CONFIG;

  const articleParams = {
    sortKey: "articleId",
    howMany: 5,
    filterKey: "articleType",
    filterValue: "fatboy",
  };

  const picParams = {
    sortKey: "picId",
    howMany: 9,
  };

  const vidParams = {
    sortKey: "vidId",
    howMany: 3,
  };

  //articles get ONLY last 5 FATBOY by default
  const articleModel = new dbModel(articleParams, articles);
  const articleArrayRaw = await articleModel.getNewestItemsByTypeArray();
  const articleArray = await fixPicDataByType(articleArrayRaw, "articles");

  //get last 9 pics by default
  const picModel = new dbModel(picParams, picsDownloaded);
  const picArrayRaw = await picModel.getNewestItemsArray();
  const picArray = await fixPicDataByType(picArrayRaw, "pics");

  //get last 3 vids by default
  const vidModel = new dbModel(vidParams, vidsDownloaded);
  const vidArrayRaw = await vidModel.getNewestItemsArray();
  const vidArray = await fixPicDataByType(vidArrayRaw, "vids");

  const dataObj = {
    articleArray: articleArray,
    picArray: picArray,
    vidArray: vidArray,
  };

  return dataObj;
};

const fixPicDataByType = async (inputArray, type) => {
  const results = [];

  switch (type) {
    case "articles":
      for (let i = 0; i < inputArray.length; i++) {
        //rebuild pic array (returns input if no picArray)
        const articlePicObj = await fixPicArray(inputArray[i]);
        results.push(articlePicObj);
      }

      return results;

    case "picSet":
      for (let i = 0; i < inputArray.length; i++) {
        const { picArray } = inputArray[i];
        if (!picArray || !picArray.length) return null;

        const picSetObj = await fixPicArray(inputArray[i]);

        results.push(picSetObj);
      }

      return results;

    case "pics":
      for (let i = 0; i < inputArray.length; i++) {
        const inputObj = inputArray[i];
        const picURL = inputArray[i].url;

        const picDataObj = await getPicData(picURL);
        if (!picDataObj) continue;

        const picObj = { ...inputObj, ...picDataObj };
        results.push(picObj);
      }

      return results;

    case "vids":
      for (let i = 0; i < inputArray.length; i++) {
        const inputObj = inputArray[i];
        if (!inputObj || !inputObj.thumbnail) continue;

        const { thumbnail } = inputObj;

        const thumbnailDataObj = await getPicData(thumbnail);
        if (!thumbnailDataObj) continue;

        const vidObj = { ...inputObj, ...thumbnailDataObj };

        results.push(vidObj);
      }

      return results;

    default:
      return null;
  }
};

//rebuild the picArray
export const fixPicArray = async (inputObj) => {
  if (!inputObj || !inputObj.picArray || !inputObj.picArray.length) return inputObj;

  const { picArray } = inputObj;
  const returnObj = { ...inputObj };

  const picDataArray = [];
  for (let i = 0; i < picArray.length; i++) {
    const picObj = await getPicData(picArray[i]);
    if (!picObj) continue;

    picDataArray.push(picObj);
  }

  returnObj.picArray = picDataArray;
  return returnObj;
};

//get pic data
export const getPicData = async (picURL) => {
  const { picsDownloaded } = CONFIG;

  //GET PIC DATA OBJ FROM DOWNLOAD COLLECTION
  const lookupParams = {
    keyToLookup: "url",
    itemValue: picURL,
  };

  const picDataModel = new dbModel(lookupParams, picsDownloaded);
  const picDataObj = await picDataModel.getUniqueItem();

  //checks if pic exists, return null if it doesnt
  if (!picDataObj || !picDataObj.savePath || !fs.existsSync(picDataObj.savePath)) return null;

  //FIND WHERE PIC IS FROM
  const picSourceObj = await getPicSourceObj(picURL);

  const picObj = { ...picDataObj, ...picSourceObj };

  return picObj;
};

//get pic source
export const getPicSourceObj = async (picURL) => {
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

    picSource = `${articleType} Article Titled "${title}"`;
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

const addVidDataToArray = async (inputArray) => {
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
  if (!vidObj || !vidObj.savePath || !fs.existsSync(vidObj.savePath)) return null;

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

  const articleArray = await fixPicDataByType(articleArrayRaw, "articles");
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

  const picArray = await fixPicDataByType(picArrayRaw, "pics");

  // //return picArray raw on just pics
  // let picArray = [];
  // if (picType === "pic-alone") {
  //   picArray = picArrayRaw;
  // } else {
  //   //otherwise, add picData to pics
  //   picArray = await fixPicDataByType(picArrayRaw, "picSets");
  // }

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

  //SEPARATE HERE BY PIC TYPE
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

  //if all DONT filter by type
  let vidArrayRaw = [];
  switch (vidSortBy) {
    case "vid-newest-to-oldest":
      vidArrayRaw = await vidModel.getNewestItemsArray();
      break;

    case "vid-oldest-to-newest":
      vidArrayRaw = await vidModel.getOldestItemsArray();
      break;
  }

  //return vid data
  let vidArrayPicRaw = [];
  if (vidType === "vid-alone") {
    vidArrayPicRaw = vidArrayRaw;
  } else {
    //otherwise, add picData to pics
    vidArrayPicRaw = await addVidDataToArray(vidArrayRaw);
  }

  const vidArray = await fixPicDataByType(vidArrayPicRaw, "vids");

  return vidArray;
};
