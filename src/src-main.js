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
    howMany: 30,
  };

  const vidParams = {
    sortKey: "vidId",
    howMany: 3,
  };

  //articles get ONLY last 5 FATBOY by default
  const articleModel = new dbModel(articleParams, articles);
  const articleArrayRaw = await articleModel.getNewestItemsByTypeArray();
  const articleArray = await addPicDataToArray(articleArrayRaw);

  //get last 30 pics by default
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
    const picObj = await parsePicObj(inputArray[i]);
    results.push(picObj);
  }

  return results;
};

const parsePicObj = async (inputObj) => {
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
  const { picsDownloaded, articles, picSetContent, vidPageContent } = CONFIG;

  //GET PIC DATA OBJ FROM DOWNLOAD COLLECTION
  const lookupParams = {
    keyToLookup: "url",
    itemValue: picURL,
  };

  const picDataModel = new dbModel(lookupParams, picsDownloaded);
  const picObj = await picDataModel.getUniqueItem();

  //checks if pic exists, return null if it doesnt
  if (!picObj || !picObj.savePath || !fs.existsSync(picObj.savePath)) return null;

  //FIND WHERE PIC IS FROM
  let picSource = "";

  //check articles
  const articleModel = new dbModel({ keyToLookup: "picArray", itemValue: picURL }, articles);
  const articleObj = await articleModel.getUniqueItem();
  //extract type
  if (articleObj) {
    const articleTitle = articleObj.title;
    const articleType = articleObj.articleType;
    //MAP ARTICLE TYPE

    picSource = `${articleType} Article Titled "${articleTitle}"`;
  }

  //check pic sets
  const picSetModel = new dbModel({ keyToLookup: "picArray", itemValue: picURL }, picSetContent);
  const picSetObj = await picSetModel.getUniqueItem();
  if (picSetObj) {
    const picSetTitle = picSetObj.title;
    if (picSource) {
      picSource = picSource + ` and Pic Set Titled ${picSetTitle}`;
    } else {
      picSource = `Pic Set Titled ${picSetTitle}`;
    }
  }

  //check vid pages
  const vidPageModel = new dbModel({ keyToLookup: "picArray", itemValue: picURL }, vidPageContent);
  const vidPageObj = await vidPageModel.getUniqueItem();
  if (vidPageObj) {
    const vidPageTitle = vidPageObj.title;
    if (picSource) {
      picSource = picSource + ` and Vid Page Titled ${vidPageTitle}`;
    } else {
      picSource = `Vid Page Titled ${vidPageTitle}`;
    }
  }

  //check if pic source is empty
  if (!picSource) {
    picSource = "PIC SOURCE FUCKED";
  }

  //add source to pic obj
  picObj.source = picSource;

  return picObj;
};

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
  let vidArray = [];
  if (vidType === "vid-alone") {
    vidArray = vidArrayRaw;
  } else {
    //otherwise, add picData to pics
    vidArray = await addVidDataToArray(vidArrayRaw);
  }

  return vidArray;
};
