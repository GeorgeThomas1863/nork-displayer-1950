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
      for (let i = 0; i < inputArray.length; i++) {
        try {
          const dataObj = inputArray[i];

          console.log("!!!DATA OBJ");
          console.dir(dataObj);

          //check thumbnail first
          if (!dataObj || !dataObj.thumbnailData || !dataObj.vidData) continue;
          const { thumbnailData, vidData } = dataObj;
          const thumbnailExists = await checkItemExists(thumbnailData);
          if (!thumbnailExists) continue;

          const vidExists = await checkItemExists(vidData, "vid");
          if (!vidExists) continue;

          dataReturnArray.push(dataObj);
          if (dataReturnArray.length === howMany) return dataReturnArray;
        } catch (e) {
          console.log(e.message + "; SAVE PATH: " + e.savePath);
          continue;
        }
      }
      break;

    //only check vid (no thumbnail data)
    case "watch":
      for (let i = 0; i < inputArray.length; i++) {
        try {
          const dataObj = inputArray[i];
          if (!dataObj || !dataObj.vidData) continue;
          const { vidData } = dataObj;

          const vidExists = await checkItemExists(vidData, "vid");
          if (!vidExists) continue;

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
  if (!dataReturnArray || !dataReturnArray.length) return null;

  return dataReturnArray;

  // //half assed answer below, NEED TO REDO
  // const newDataArray = await rePullData(dataType, howMany);

  // console.log("NEW DATA ARRAY");
  // console.log(newDataArray);

  // return newDataArray;
};

//re-write to use fs
export const checkItemExists = async (inputObj, type = "pic") => {
  const { savePath, downloadedSize, vidSizeBytes, vidSaveFolder } = inputObj;

  const itemSavePath = type === "pic" ? savePath : type === "vid" ? vidSaveFolder : 0;
  const checkSizeRaw = type === "pic" ? downloadedSize : type === "vid" ? vidSizeBytes : 0;

  if (!fs.existsSync(itemSavePath) || !checkSizeRaw) {
    const error = new Error("ITEM NOT DOWNLOADED / CORRUPTED");
    error.savePath = itemSavePath;
    throw error;
  }

  //GET FILE SIZE FRM FILE (TEST THIS)
  const fileSize = fs.statSync(itemSavePath).size;

  //check for slightly smaller file
  const checkSize = checkSizeRaw * 0.7;
  if (!fileSize || fileSize < checkSize) {
    // console.log("AHHHHHHHHHHHHHHHHHHHH");
    const error = new Error("FILE CORRUPTED / WRONG SIZE");
    error.savePath = itemSavePath;
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
      // console.log("LATEST VID");
      // console.log(latestVidId);

      const vidParams = {
        sortKey: "date",
        sortKey2: "vidPageId",
        howMany: howMany,
        filterKey: "vidData.vidId",
        filterValue: { $lte: latestVidId },
      };

      // console.log("VID PARAMS");
      // console.log(vidParams);

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
