import fs from "fs";
import { rePullData } from "./src-main.js";

//REMOVE INVALID ITEMS FROM RETURN
export const removeInvalidItems = async (inputArray, dataType, howMany) => {
  if (!inputArray || !inputArray.length || !dataType) return null;

  console.log("REMOVE INVALID ITEMS DATA TYPE");
  console.log(dataType);
  console.log(inputArray);

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
            const { savePath } = picObj;
            const itemExists = await checkItemExists(savePath);
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

    // case "pics":
    //   for (let i = 0; i < inputArray.length; i++) {
    //     try {
    //       const picObj = inputArray[i];
    //       if (!picObj || !picObj.savePath) continue;
    //       const { savePath } = picObj;
    //       const itemExists = await checkItemExists(savePath);
    //       if (!itemExists) continue;

    //       dataReturnArray.push(picObj);
    //       if (dataReturnArray.length === howMany) return dataReturnArray;
    //     } catch (e) {
    //       console.log(e.message + "; SAVE PATH: " + e.savePath + "; PICURL: " + e.url);
    //       continue;
    //     }
    //   }
    //   break;

    case "vids":
      for (let i = 0; i < inputArray.length; i++) {
        try {
          const dataObj = inputArray[i];
          //check thumbnail first
          if (!dataObj || !dataObj.thumbnailData || !dataObj.thumbnailData.savePath) continue;
          const thumbnailExists = await checkItemExists(dataObj.thumbnailData.savePath);
          if (!thumbnailExists) continue;

          //check vid exists
          if (!dataObj || !dataObj.vidData || !dataObj.vidData.savePath) continue;
          const { savePath } = dataObj.vidData;

          const itemExists = await checkItemExists(savePath);
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

  //half assed answer below, might need to redo
  const newDataArray = await rePullData(dataType, howMany);

  return newDataArray;
};

//re-write to use fs
export const checkItemExists = async (savePath) => {
  if (!savePath) return null;

  if (!fs.existsSync(savePath)) {
    const error = new Error("ITEM NOT DOWNLOADED");
    error.savePath = savePath;
    throw error;
  }

  //otherwise return true
  return true;
};
