import fs from "fs";
import CONFIG from "../config/config.js";
import { articleTypeMap, backendDefaultParams } from "../config/map-display.js";
import dbModel from "../models/db-model.js";

//gets backend data from db
export const runGetBackendData = async () => {
  // const { backendTypeArr, articles, picsDownloaded, picSetContent, vidsDownloaded, vidPageContent } = CONFIG;
  const { backendTypeArr } = CONFIG;

  const dataObj = {};
  for (let i = 0; i < backendTypeArr.length; i++) {
    const backendType = backendTypeArr[i];
    const backendParams = backendDefaultParams[backendType];
    const backendCollection = backendParams.collection;
    const dataModel = new dbModel(backendParams, backendCollection);
    const dataArrayRaw = await dataModel.getNewestItemsArray();
    const dataArray = await fixPicDataByType(dataArrayRaw, backendType);
    dataObj[backendType] = dataArray;
  }

  console.log("DATA RETURN LENGTHS");
  console.log(dataObj.articles.length);
  console.log(dataObj.pics.length);
  console.log(dataObj.picSets.length);
  console.log(dataObj.vids.length);
  console.log(dataObj.vidPages.length);

  return dataObj;

  // //come up with less dumb way to set params
  // const articleParams = {
  //   sortKey: "articleId",
  //   howMany: 5,
  //   filterKey: "articleType",
  //   filterValue: "fatboy",
  // };

  // const picParams = {
  //   sortKey: "picId",
  //   howMany: 9,
  // };

  // const picSetParams = {
  //   sortKey: "picSetId",
  //   howMany: 5,
  // };

  // const vidParams = {
  //   sortKey: "vidId",
  //   howMany: 3,
  // };

  // const vidPageParams = {
  //   sortKey: "vidPageId",
  //   howMany: 5,
  // };

  // //articles get ONLY last 5 FATBOY by default
  // const articleModel = new dbModel(articleParams, articles);
  // const articleArrayRaw = await articleModel.getNewestItemsByTypeArray();
  // const articleArray = await fixPicDataByType(articleArrayRaw);

  // //get last 9 pics by default
  // const picModel = new dbModel(picParams, picsDownloaded);
  // const picArrayRaw = await picModel.getNewestItemsArray();
  // const picArray = await fixPicDataByType(picArrayRaw);

  // const picSetModel = new dbModel(picSetParams, picSetContent);
  // const picSetArrayRaw = await picSetModel.getNewestItemsArray();
  // const picSetArray = await fixPicDataByType(picSetArrayRaw);

  // //get last 3 vids by default
  // const vidModel = new dbModel(vidParams, vidsDownloaded);
  // const vidArrayRaw = await vidModel.getNewestItemsArray();
  // const vidArray = await fixPicDataByType(vidArrayRaw);

  // const vidPageModel = new dbModel(vidPageParams, vidPageContent);
  // const vidPageArrayRaw = await vidPageModel.getNewestItemsArray();
  // const vidPageArray = await fixPicDataByType(vidPageArrayRaw);

  // const dataObj = {
  //   articleArray: articleArray,
  //   picArray: picArray,
  //   picSetArray: picSetArray,
  //   vidArray: vidArray,
  //   vidPageArray: vidPageArray,
  // };

  // console.log("DATA RETURN LENGTHS");
  // console.log(articleArray.length);
  // console.log(picArray.length);
  // console.log(picSetArray.length);
  // console.log(vidArray.length);
  // console.log(vidPageArray.length);

  // // console.log("VID ARRAY");
  // // console.log(vidArray);

  // return dataObj;
};

//RE-WRITE FIXING THE FUCKING PICS AS A SINGLE LOOP THAT GOES THROUGH DATAOBJ

//ADD IN PIC SETS AND VID PAGES
export const fixPicDataByType = async (inputArray, backendType) => {
  if (!inputArray) return null;

  const results = [];
  for (let i = 0; i < inputArray.length; i++) {
    const inputObj = inputArray[i];
    // const { articleId, picSetId, thumbnail } =
    // const dataType = await deriveDataType(inputObj);

    switch (backendType) {
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
      case "vids":
      case "vidPages":
        //return input
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

//incredibly stupid but dont care
// export const deriveDataType = async (inputObj) => {
//   const { articleId, picId, picSetId, vidId, vidPageId } = inputObj;

//   if (articleId) return "articles";

//   if (picId) return "pics";

//   if (picSetId) return "picSets";

//   if (vidId) return "vids";

//   if (vidPageId) return "vidPages";

//   return null;
// };

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

  const articleArray = await fixPicDataByType(articleArrayRaw);
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

  const picArray = await fixPicDataByType(picArrayRaw);

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
  let vidArrayPicRaw = [];
  switch (vidSortBy) {
    case "vid-newest-to-oldest":
      vidArrayPicRaw = await vidModel.getNewestItemsArray();
      break;

    case "vid-oldest-to-newest":
      vidArrayPicRaw = await vidModel.getOldestItemsArray();
      break;
  }

  const vidArrayRaw = await fixPicDataByType(vidArrayPicRaw);

  let vidArray = [];
  if (vidType === "vid-alone") {
    vidArray = vidArrayRaw;
  } else {
    //otherwise, add picData to pics
    vidArray = await addVidDataToArray(vidArrayRaw);
  }

  return vidArray;
};
