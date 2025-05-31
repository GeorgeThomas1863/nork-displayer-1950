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
    howMany: 12,
  };

  const vidParams = {
    sortKey: "vidId",
    howMany: 3,
  };

  //articles get ONLY last 5 FATBOY by default
  const articleModel = new dbModel(articleParams, articles);
  const articleArrayRaw = await articleModel.getNewestItemsByTypeArray();
  const articleArray = await addPicDataToArray(articleArrayRaw);

  //get last 12 pics by default
  const picModel = new dbModel(picParams, picsDownloaded);
  const picArray = await picModel.getNewestItemsArray();

  //get last 3 vids by default
  const vidModel = new dbModel(vidParams, vidsDownloaded);
  const vidArray = await vidModel.getNewestItemsArray();

  const dataObj = {
    articleArray: articleArray,
    picArray: picArray,
    vidArray: vidArray,
  };

  return dataObj;
};

const addPicDataToArray = async (inputArray) => {
  const results = [];
  for (let i = 0; i < inputArray.length; i++) {
    const articleObj = await parseArticleObj(inputArray[i]);
    results.push(articleObj);
  }

  return results;
};

const parseArticleObj = async (inputObj) => {
  const { picArray } = inputObj;
  if (!picArray || !picArray.length) return inputObj;

  //create new article obj
  const articlePicObj = { ...inputObj };

  //rebuild pic array
  const picDataArray = [];
  for (let i = 0; i < picArray.length; i++) {
    try {
      const picObj = await getPicData(picArray[i]);

      picDataArray.push(picObj);
    } catch (e) {
      console.log(e);
    }
  }

  articlePicObj.picArray = picDataArray;

  return articlePicObj;
};

const getPicData = async (picURL) => {
  const { picsDownloaded } = CONFIG;

  const lookupParams = {
    keyToLookup: "url",
    itemValue: picURL,
  };

  const picDataModel = new dbModel(lookupParams, picsDownloaded);
  const picObj = await picDataModel.getUniqueItem();

  //checks if pic exists, return null if it doesnt
  if (!picObj || !picObj.savePath || !fs.existsSync(picObj.savePath)) return null;

  return picObj;
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

  const articleArray = await addPicDataToArray(articleArrayRaw);
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

  //return picArray raw on just pics
  let picArray = [];
  if (picType === "pic-alone") {
    picArray = picArrayRaw;
  } else {
    //otherwise, add picData to pics
    picArray = await addPicDataToArray(picArrayRaw);
  }

  return picArray;
};

// sortKey, howMany, filterKey, filterValue;
