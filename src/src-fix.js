import fs from "fs";
import fsPromises from "fs/promises";
import ffprobe from "ffprobe";
import ffprobeStatic from "ffprobe-static";

import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";

export const getStreamData = async (inputArray, dataType) => {
  if (!inputArray || !inputArray.length) return null;

  const dataReturnArray = [];
  for (let i = 0; i < inputArray.length; i++) {
    try {
      const dataObj = inputArray[i];
      if (!dataObj) continue;

      const vidSaveFolder = await fixVidSaveFolder(dataObj, dataType);

      const chunkArray = await fsPromises.readdir(vidSaveFolder);
      const streamData = await parseChunkArray(chunkArray, vidSaveFolder);
      if (!streamData || !streamData.length) continue;

      dataObj.streamData = streamData;
      dataReturnArray.push(dataObj);
    } catch (e) {
      console.log(e.message + "; SAVE PATH: " + e.savePath);
      continue;
    }
  }
  return dataReturnArray;
};

//used different fucking vidSaveFolder format for watch, fixing here
export const fixVidSaveFolder = async (dataObj, dataType) => {
  if (!dataObj || !dataType) return null;

  let folderInputPath = "";
  switch (dataType) {
    case "vids":
      folderInputPath = dataObj.vidData.vidSaveFolder;
      break;

    case "watch":
      folderInputPath = dataObj.vidSaveFolder;
      break;
  }

  if (!folderInputPath) {
    const error = new Error("CANT FIND VID SAVE FOLDER");
    error.savePath = dataObj;
    throw error;
  }

  return folderInputPath;
};

export const parseChunkArray = async (inputArray, vidSaveFolder) => {
  if (!inputArray || !inputArray.length || !vidSaveFolder) {
    const error = new Error("NO CHUNKS FOUND AT PATH");
    error.savePath = vidSaveFolder;
    throw error;
  }

  const streamData = [];
  for (let i = 0; i < inputArray.length; i++) {
    try {
      const chunkName = await parseChunkName(inputArray[i]);
      if (!chunkName) continue;

      const chunkPath = vidSaveFolder + chunkName;

      if (!fs.existsSync(chunkPath)) {
        const error = new Error("CHUNK DOESNT EXIST");
        error.savePath = chunkPath;
        throw error;
      }

      //use ffprobe to get info on chunk
      const chunkData = await ffprobe(chunkPath, { path: ffprobeStatic.path });
      const duration = chunkData.streams[0].duration; // duration in seconds
      const chunkSizeBytes = chunkData.format?.size; // file size in bytes

      console.log("CHUNK DATA");
      console.log(duration);
      console.log(chunkSizeBytes);

      //return other data about chunk if needed
      const returnObj = {
        chunkName: chunkName,
        chunkPath: chunkPath,
      };

      streamData.push(returnObj);
    } catch (e) {
      console.log(e.message + "; SAVE PATH: " + e.savePath);
      continue;
    }
  }

  return streamData;
};

export const parseChunkName = async (inputName) => {
  if (!inputName) return null;
  if (!inputName.toLowerCase().endsWith(".mp4") || !inputName.toLowerCase().startsWith("chunk_")) return null;

  return inputName;
};

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

          // console.log("!!!DATA OBJ");
          // console.dir(dataObj);

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
          if (!dataObj) continue;

          const vidExists = await checkItemExists(dataObj, "vid");
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
  const { savePath, vidSaveFolder } = inputObj;

  const itemSavePath = type === "pic" ? savePath : type === "vid" ? vidSaveFolder : 0;

  if (!fs.existsSync(itemSavePath)) {
    const error = new Error("ITEM NOT DOWNLOADED / CORRUPTED");
    error.savePath = itemSavePath;
    throw error;
  }

  //not worth checking below
  // const checkSizeRaw = type === "pic" ? downloadedSize : type === "vid" ? vidSizeBytes : 0;
  // //GET FILE SIZE FRM FILE (TEST THIS)
  // const fileSize = fs.statSync(itemSavePath).size;

  // //check for slightly smaller file
  // const checkSize = checkSizeRaw * 0.7;
  // if (!fileSize || fileSize < checkSize) {
  //   // console.log("AHHHHHHHHHHHHHHHHHHHH");
  //   const error = new Error("FILE CORRUPTED / WRONG SIZE");
  //   error.savePath = itemSavePath;
  //   throw error;
  // }

  // //otherwise return true
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
