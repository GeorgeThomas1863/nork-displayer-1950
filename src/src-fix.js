import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";
import { getPicData, getVidData, rePullData } from "./src-get.js";
import { checkItemExists } from "./src-check.js";

//FIX DATA SECTION
// export const fixInputDefaults = async (inputObj) => {
//   const { dataType, howMany } = inputObj;
//   const { articlesHowMany, picsHowMany, picSetsHowMany, vidsHowMany, vidPagesHowMany } = CONFIG;
//   const returnObj = { ...inputObj };

//   // console.log("FIX INPUT DEFAULTS");
//   // console.log(inputObj);

//   if (!howMany) {
//     let returnHowMany = 0;
//     switch (dataType) {
//       case "articles":
//         returnHowMany = articlesHowMany;
//         break;

//       case "pics":
//         returnHowMany = picsHowMany;
//         break;

//       case "picSets":
//         returnHowMany = picSetsHowMany;
//         break;

//       case "vids":
//         returnHowMany = vidsHowMany;
//         break;

//       case "vidPages":
//         returnHowMany = vidPagesHowMany;
//         break;
//     }

//     returnObj.howMany = returnHowMany;
//     return returnObj;
//   }

//   console.log("RETURN OBJ");
//   console.log(returnObj);

//   return returnObj;
// };

//----------------------------

//ADD IN PIC SETS AND VID PAGES
export const fixDataByType = async (inputArray, dataType) => {
  if (!inputArray) return null;

  const results = [];
  for (let i = 0; i < inputArray.length; i++) {
    const inputObj = inputArray[i];

    // console.log("FIX DATA BY TYPE INPUT");
    // console.log(inputObj);

    switch (dataType) {
      //single pics
      case "pics":
        const { url } = inputObj;

        const picDataObj = await getPicData(url);
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
      case "vidPages":
        const vidDataObj = await fixVidPageObj(inputObj);
        // console.log("VID DATA OBJ");
        // console.log(vidDataObj);
        if (!vidDataObj) continue;

        const vidPageObj = { ...vidDataObj, ...inputObj };
        results.push(vidPageObj);
        break;

      //might need to fix thumbnail (prob not)
      case "vids":
        //check if vid exists
        try {
          const vidAloneDataObj = await getVidData(inputObj.url);
          //   console.log("VID ALONE DATA OBJ");
          //   console.log(vidAloneDataObj);
          if (!vidAloneDataObj) continue;

          const vidAloneObj = { ...vidAloneDataObj, ...inputObj };
          results.push(vidAloneObj);
          break;
        } catch (e) {
          console.log(e.message + "; SAVE PATH: " + e.savePath + "; VIDURL: " + e.url);
          continue;
        }
    }
  }

  return results;
};

//-------------------------

//FIX PIC DATA

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

//---------------------------

//FIX VID DATA

export const fixVidPageObj = async (inputObj) => {
  // console.log("ON THIS PART FAGGOT");
  // console.log(inputObj);S

  if (!inputObj || !inputObj.vidURL) return null;
  const { vidURL } = inputObj;

  //DONT RETURN NULL HERE
  try {
    const vidDataObj = await getVidData(vidURL);
    // if (!vidDataObj) return null;

    const vidPageObj = { ...vidDataObj, ...inputObj };
    return vidPageObj;
  } catch (e) {
    console.log(e.message + "; SAVE PATH: " + e.savePath + "; VIDURL: " + e.url);
    return null;
  }
};

//--------------------

//REMOVE INVALID ITEMS FROM RETURN

export const removeInvalidItems = async (inputArray, dataType, howMany) => {
  if (!inputArray || !inputArray.length || !dataType) return null;

  // console.log("REMOVE INVALID ITEMS DATA TYPE");
  // console.log(dataType);
  // console.log(howMany);

  const dataReturnArray = [];
  switch (dataType) {
    //delete pics that dont exist from picArray
    case "articles":
    case "picSets":
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
            const url = picArray[j];
            const itemExists = await checkItemExists(url);
            if (!itemExists) continue;

            picArrayFixed.push(url);
          } catch (e) {
            console.log(e.message + "; SAVE PATH: " + e.savePath + "; PICURL: " + e.url);
            continue;
          }
        }

        dataObj.picArray = picArrayFixed;
        dataReturnArray.push(dataObj);

        //check if right length return when it is
        if (dataReturnArray.length === howMany) return dataReturnArray;
      }
      break;

    case "pics":
      for (let i = 0; i < inputArray.length; i++) {
        const dataObj = inputArray[i];
        if (!dataObj || !dataObj.url) continue;
        const { url } = dataObj;

        const itemExists = await checkItemExists(url);
        if (!itemExists) continue;

        dataReturnArray.push(dataObj);
        if (dataReturnArray.length === howMany) return dataReturnArray;
      }
      break;

    case "vids":
    case "vidPages":
      for (let i = 0; i < inputArray.length; i++) {
        const dataObj = inputArray[i];
        // console.log("VID REMOVE DATA OBJ");
        // console.log(dataObj);
        if (!dataObj || !dataObj.url) continue;
        const { url } = dataObj;

        const itemExists = await checkItemExists(url);
        if (!itemExists) continue;

        dataReturnArray.push(dataObj);
        if (dataReturnArray.length === howMany) return dataReturnArray;
      }
      break;
  }

  //half assed answer below, might need to do same for picSets
  const newDataArray = await rePullData(dataType, howMany);

  return newDataArray;
};
