import fs from "fs";
import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";

//gets backend data from db
export const runGetBackendData = async () => {
  const { articles, picSetContent, vidPageContent } = CONFIG;
  const params = {
    sortKey: "date",
    howMany: 10,
  };

  const articleModel = new dbModel(params, articles);
  const articleArrayRaw = await articleModel.getLastItemsArray();
  const articleArray = await addArticlePicData(articleArrayRaw);

  const picSetModel = new dbModel(params, picSetContent);
  const picSetArray = await picSetModel.getLastItemsArray();

  const vidPageModel = new dbModel(params, vidPageContent);
  const vidPageArray = await vidPageModel.getLastItemsArray();

  const dataObj = {
    articleData: articleArray,
    picSetData: picSetArray,
    vidPageData: vidPageArray,
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
