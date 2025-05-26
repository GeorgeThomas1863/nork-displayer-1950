import fs from "fs";
import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";

//gets backend data from db
export const runGetBackendData = async () => {
  const { articles, picsDownloaded, vidsDownloaded } = CONFIG;

  const vidParams = {
    sortKey: "date",
    howMany: 3,
  };

  const picParams = { ...vidParams };
  picParams.howMany = 9;

  const articleParams = { ...vidParams, filterKey: "articleType", filterValue: "fatboy" };
  articleParams.howMany = 5;

  //articles get ONLY last 5 FATBOY by default
  const articleModel = new dbModel(articleParams, articles);
  const articleArrayRaw = await articleModel.getLastItemsByTypeArray();
  const articleArray = await addArticlePicData(articleArrayRaw);

  //get last 9 pics by default
  const picModel = new dbModel(picParams, picsDownloaded);
  const picArray = await picModel.getLastItemsArray();

  //get last 3 vids by default
  const vidModel = new dbModel(vidParams, vidsDownloaded);
  const vidArray = await vidModel.getLastItemsArray();

  const dataObj = {
    articleArray: articleArray,
    picArray: picArray,
    vidArray: vidArray,
  };

  return dataObj;
};

const addArticlePicData = async (inputArray) => {
  const articlePicArray = [];
  for (let i = 0; i < inputArray.length; i++) {
    const articleObj = await parseArticleObj(inputArray[i]);
    articlePicArray.push(articleObj);
  }

  return articlePicArray;
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
