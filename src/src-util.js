import CONFIG from "../config/config.js";
import { clickIdTriggerMap, expandTriggerMap, inputIdTriggerMap } from "../config/map-display.js";
import { getPicData } from "./src-main.js";

//FIX DATA SECTION
export const fixInputDefaults = async (inputObj) => {
  const { dataType, howMany } = inputObj;
  const { articlesHowMany, picsHowMany, picSetsHowMany, vidsHowMany, vidPagesHowMany } = CONFIG;
  const returnObj = { ...inputObj };

  if (howMany) return returnObj;

  let returnHowMany = 0;
  switch (dataType) {
    case "articles":
      returnHowMany = articlesHowMany;
      break;

    case "pics":
      returnHowMany = picsHowMany;
      break;

    case "picSets":
      returnHowMany = picSetsHowMany;
      break;

    case "vids":
      returnHowMany = vidsHowMany;
      break;

    case "vidPages":
      returnHowMany = vidPagesHowMany;
      break;
  }

  returnObj.howMany = returnHowMany;
  return returnObj;
};

//ADD IN PIC SETS AND VID PAGES
export const fixDataByType = async (inputArray, dataType) => {
  if (!inputArray) return null;

  const results = [];
  for (let i = 0; i < inputArray.length; i++) {
    const inputObj = inputArray[i];

    // console.log("INPUT OBJ");
    // console.log(inputObj);

    // console.log("DATA TYPE");
    // console.log(dataType);

    switch (dataType) {
      //single pics
      case "pics":
        const { url } = inputObj;

        const picDataObj = await getPicData(url);
        console.log("PIC DATA OBJ");
        console.log(picDataObj);
        // if (!picDataObj) continue;

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
        //return input
        const vidDataObj = await fixVidDataArray(inputObj);
        if (!vidDataObj) continue;

        const vidObj = { ...vidDataObj, ...inputObj };
        results.push(vidObj);
        break;

      //might need to fix thumbnail (prob not)
      case "vids":
        results.push(inputObj);
        break;
    }
  }

  return results;
};

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

export const fixVidDataArray = async (inputArray) => {
  const results = [];
  for (let i = 0; i < inputArray.length; i++) {
    //only one vid so dont need to parse out array (like in pics)
    const vidObj = await getVidData(inputArray[i].url);
    results.push(vidObj);
  }

  return results;
};

//--------------------------------

//CHECK DATA SECTION

export const checkDataType = async (inputObj) => {
  if (!inputObj) return null;
  const { picType, vidType, commandType } = inputObj;

  // console.log("COMMAND TYPE");
  // console.log(commandType);

  let dataType = "";
  switch (commandType) {
    case "click":
      dataType = await checkClickId(inputObj);
      break;

    case "expand":
      dataType = await checkExpandType(inputObj);
      break;

    case "input":
      dataType = await checkInputId(inputObj);
      break;
  }

  if (!dataType) return null;

  if (dataType === "pics") {
    switch (picType) {
      case "pic-alone":
        return "pics";

      case "pic-sets":
        return "picSets";
    }
  }

  if (dataType === "vids") {
    switch (vidType) {
      case "vid-alone":
        return "vids";

      case "vid-pages":
        return "vidPages";
    }
  }

  return dataType;
};

export const checkExpandType = async (inputObj) => {
  if (!inputObj || !inputObj.expandType) return null;
  const { expandType } = inputObj;

  // console.log("INPUT OBJ");
  // console.log(inputObj);

  const expandTrigger = expandTriggerMap[expandType];
  return expandTrigger;
};

export const checkClickId = async (inputObj) => {
  if (!inputObj || !inputObj.clickId) return null;
  const { clickId } = inputObj;

  //loop
  for (const k in clickIdTriggerMap) {
    const trigger = clickIdTriggerMap[k];
    if (trigger.includes(clickId)) {
      return k;
    }
  }

  return null;
};

export const checkInputId = async (inputObj) => {
  if (!inputObj || !inputObj.inputId) return null;
  const { inputId } = inputObj;

  const inputTrigger = inputIdTriggerMap[inputId];
  return inputTrigger;
};
