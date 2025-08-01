import fs from "fs";
import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";

//REMOVE INVALID ITEMS FROM RETURN
export const removeInvalidItems = async (inputArray, dataType, howMany) => {
  if (!inputArray || !inputArray.length || !dataType) return null;

  const dataReturnArray = [];
  switch (dataType) {
    //delete pics that dont exist from picArray
    case "articles":
    case "pics":
      for (let i = 0; i < inputArray.length; i++) {
        //extract picArray
        const dataObj = inputArray[i];
        const { picArray } = dataObj;
        if (!picArray) {
          dataReturnArray.push(dataObj);
          if (dataReturnArray.length === howMany) return dataReturnArray;
          continue;
        }

        //check if exists
        const picArrayFixed = [];
        for (let j = 0; j < picArray.length; j++) {
          try {
            const picObj = picArray[j];
            if (!picObj || !picObj.savePath) continue;
            const itemExists = await checkItemExists(picObj);
            if (!itemExists) continue;

            picArrayFixed.push(picObj);
          } catch (e) {
            console.log(e.message + "; SAVE PATH: " + e.savePath);
            continue;
          }
        }

        dataObj.picArray = picArrayFixed;
        dataReturnArray.push(dataObj);

        //check if right length return when it is
        if (dataReturnArray.length === howMany) return dataReturnArray;
      }
      break;

    case "vids":
      // console.log("REMOVE INVALID ITEMS DATA TYPE");
      // console.log(dataType);
      // console.log(inputArray);
      for (let i = 0; i < inputArray.length; i++) {
        try {
          const dataObj = inputArray[i];

          //check thumbnail first
          if (!dataObj || !dataObj.thumbnailData) continue;
          const { thumbnailData } = dataObj;
          const thumbnailExists = await checkItemExists(thumbnailData);
          if (!thumbnailExists) continue;

          //check vid exists
          if (!dataObj || !dataObj.vidData) continue;
          const { vidData } = dataObj;

          const itemExists = await checkItemExists(vidData, "vid");
          if (!itemExists) continue;

          dataReturnArray.push(dataObj);
          if (dataReturnArray.length === howMany) return dataReturnArray;
        } catch (e) {
          console.log(e.message + "; SAVE PATH: " + e.savePath);
          continue;
        }
      }
      break;
  }

  //needed if how many is stupidly high
  if (dataReturnArray && dataReturnArray.length) return dataReturnArray;

  //half assed answer below, might need to redo
  const newDataArray = await rePullData(dataType, howMany);

  // console.log("NEW DATA ARRAY");
  // console.log(newDataArray);

  return newDataArray;
};

//re-write to use fs
export const checkItemExists = async (inputObj, type = "pic") => {
  const { savePath } = inputObj;
  if (!savePath) return null;

  // console.log("CHECK ITEM EXISTS");
  // console.log(inputObj);

  if (!fs.existsSync(savePath)) {
    const error = new Error("ITEM NOT DOWNLOADED");
    error.savePath = savePath;
    throw error;
  }

  let checkSizeRaw = 0;
  //adult would write this with ternary operator, change later
  switch (type) {
    case "pic":
      const { downloadedSize } = inputObj;
      checkSizeRaw = downloadedSize;
      break;

    case "vid":
      const { vidSizeBytes } = inputObj;
      checkSizeRaw = vidSizeBytes;
      break;
  }

  if (!checkSizeRaw) {
    // console.log("AHHHHHHHHHHHHHHHHHHHH");
    // console.log(inputObj);
    // console.log(type);
    const error = new Error("FILE CORRUPTED / WRONG SIZE");
    error.savePath = savePath;
    throw error;
  }

  //GET FILE SIZE FRM FILE (TEST THIS)
  const fileSize = fs.statSync(savePath).size;

  //check for slightly smaller file
  const checkSize = checkSizeRaw * 0.7;
  if (!fileSize || fileSize < checkSize) {
    // console.log("AHHHHHHHHHHHHHHHHHHHH");
    const error = new Error("FILE CORRUPTED / WRONG SIZE");
    error.savePath = savePath;
    throw error;
  }

  //otherwise return true
  return true;
};

//[half assed answer below, might need to do same for picSets / assumes prob is newest shit not downloaded]
//RE-GET / PULL DATA
export const rePullData = async (dataType, howMany) => {
  const { vidPageContent, vidPath } = CONFIG;

  // console.log("RE-PULL DATA DATA TYPE TRIGGERED");
  // console.log(dataType);
  // console.log(howMany);

  //REBUILD SO IT JUST GETS THE FUCKING FILE ON THE DRIVE
  switch (dataType) {
    case "vids":
      //get vid array on drive
      const vidArrayFS = fs.readdirSync(vidPath);

      const latestVidId = await getLatestVid(vidArrayFS);
      console.log("LATEST VID");
      console.log(latestVidId);

      const vidParams = {
        sortKey: "date",
        sortKey2: "vidPageId",
        howMany: howMany,
        filterKey: "vidData.vidId",
        filterValue: { $lte: latestVidId },
      };

      console.log("VID PARAMS");
      console.log(vidParams);

      const vidDataModel = new dbModel(vidParams, vidPageContent);
      const vidDataArray = await vidDataModel.getNewestItemsByTypeArray();

      return vidDataArray;
  }

  return null;
};

//return the vidId of latest vid on fs
export const getLatestVid = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;
  const { vidsDownloaded, vidPath } = CONFIG;

  const sortArray = inputArray.sort((a, b) => {
    const numA = parseInt(a.replace(".mp4", ""));
    const numB = parseInt(b.replace(".mp4", ""));
    return numB - numA; // numB - numA for descending order
  });

  //loop through array
  for (let i = 0; i < sortArray.length; i++) {
    const vidName = sortArray[i];
    const vidFullPath = vidPath + vidName;

    //double check if it exists (not necessary)
    const vidExists = fs.existsSync(vidFullPath);
    if (!vidExists) continue;

    const dataParams = {
      keyToLookup: "savePath",
      itemValue: vidFullPath,
    };

    const dataModel = new dbModel(dataParams, vidsDownloaded);
    const vidDataObj = await dataModel.getUniqueItem();
    if (!vidDataObj || !vidDataObj.vidSizeBytes) return null;
    const { vidSizeBytes, vidId } = vidDataObj;

    //check slightly smaller
    const checkSize = vidSizeBytes * 0.7;
    const fileSize = fs.statSync(vidFullPath).size;
    if (fileSize < checkSize) continue;

    return vidId;
  }

  return null;
};
