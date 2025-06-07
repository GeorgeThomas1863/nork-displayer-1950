import CONFIG from "../config/config.js";
import { getPicData, getVidData } from "./src-get.js";

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

//----------------------------

//ADD IN PIC SETS AND VID PAGES
export const fixDataByType = async (inputArray, dataType) => {
  if (!inputArray) return null;

  console.log("FIX DATA BY TYPE");
  console.log(dataType);

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
        //return input
        const vidDataObj = await fixVidPageArray(inputObj);
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
        } catch (error) {
          console.log("ERROR GETTING VID ALONE");
          console.log(error);
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

export const fixVidPageArray = async (inputArray) => {
  //   console.log("FIX VID ARRAY INPUT");
  //   console.log(inputArray);

  const results = [];
  for (let i = 0; i < inputArray.length; i++) {
    try {
      const inputObj = inputArray[i];
      //only one vid so dont need to parse out array (like in pics)
      const vidDataObj = await getVidData(inputObj.url);
      if (!vidDataObj) continue;

      const vidPageObj = { ...vidDataObj, ...inputObj };
      results.push(vidPageObj);
    } catch (error) {
      console.log("ERROR GETTING VID PAGE DATA");
      console.log(error);
      continue;
    }
  }

  return results;
};
