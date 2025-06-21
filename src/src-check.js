// import fs from "fs";
import { expandTriggerMap, inputIdTriggerMap } from "../config/map-display.js";
import { getPicExtraData } from "./src-get.js";

//--------------------------------

//CHECK DATA
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

//----------------------

//throw error if item doesnt exist
// export const checkItemExists = async (inputObj, type = "pic") => {
//   if (!inputObj || !inputObj.savePath) return null;
//   const { savePath, url } = inputObj;

//   if (!savePath || !fs.existsSync(savePath)) {
//     console.log("AHHHHHHHHHHHHHHHH");
//     console.log(`${type.toUpperCase()} NOT DOWNLOADED`);
//     console.log("ITEM URL: " + url);
//     return null;
//   }

//   return true;
// };

export const checkItemExists = async (url, type = "pic") => {
  if (!url) return null;

  //auto throws error if vid doesnt exist
  if (type === "vid") {
    await getVidData(url);
    return true;
  }

  //otherwise test pics
  const params = {
    keyToLookup: "url",
    itemValue: url,
  };

  //throws error if pic doesnt exist
  await getPicExtraData(params);
  return true;
};
