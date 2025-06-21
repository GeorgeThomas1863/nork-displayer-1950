import d from "./define-things.js";
import { buildInputParams } from "./util.js";

export const state = {
  route: "/get-backend-data-route",
  dataType: "pics",
  isFirstLoad: true,
  //data already requested
  dataReq: d.defaultInputMap,
  dataLoaded: null,
  trigger: null,
};

export const updateDataLoaded = async (inputArray) => {
  // const { backendTypeArr } = d;
  console.log("BACKEND TYPE ARRAY");
  console.dir(inputArray);

  const returnObj = {};
  for (let i = 0; i < inputArray.length; i++) {
    const inputItem = inputArray[i];
    const numberLoaded = inputItem.dataArray.length;
    returnObj[inputItem.dataType] = numberLoaded;
  }

  state.dataLoaded = returnObj;

  return true;
};

export const checkEventTriggered = async (changeId) => {
  const { changeTriggerArr } = d;

  for (let i = 0; i < changeTriggerArr.length; i++) {
    if (changeId === changeTriggerArr[i]) return true;
  }

  return null;
};

export const newDataTrigger = async () => {
  const { isFirstLoad, dataReq } = state;

  //trigger new data on first load
  if (isFirstLoad) return true;

  const inputParams = await buildInputParams();
  // const defaultParams = d.defaultInputMap;

  // console.log("!!!!!!!DEFAULT PARAMS");
  // console.dir(defaultParams);

  for (let k in dataReq) {
    const defaultItem = dataReq[k];
    const inputItem = inputParams[k];

    //pass condition
    if (defaultItem === inputItem) continue;

    const moreDataNeeded = await checkMoreDataNeeded(k, inputItem);
    if (!moreDataNeeded) continue;

    // console.log("k");
    // console.log(k);

    //trigger new data, set the dataReq first
    state.dataReq = inputParams;
    state.trigger = k;
    // console.log("STATE");
    // console.dir(state);
    return true;
  }

  return false;
};

//basically return true except for how many
export const checkMoreDataNeeded = async (k, inputItem) => {
  const { dataReq, dataLoaded } = state;
  //return true on all sorts (just assume not loaded)
  if (k.includes("-to-")) return true;

  //RETURN TRUE EXCEPT FOR HOW MANY
  return true;

  // console.log("k");
  // console.log(k);
  // console.log("inputItem");
  // console.log(inputItem);
  // console.log("dataReq");
  // console.dir(dataReq);
  // console.log("dataLoaded");
  // console.dir(dataLoaded);

  // if (inputItem === defaultItem) return false;

  // return true;
};

// MAKE BELOW CLICK TRIGGER
// export const checkNewDataTrigger = async (inputObj) => {
//     const { clickId, expandType, inputId } = inputObj;

//     for (let i = 0; i < d.clickTriggerArr.length; i++) {
//       if (clickId === d.clickTriggerArr[i]) {
//         return "click";
//       }
//     }

//     for (let i = 0; i < d.expandTriggerArr.length; i++) {
//       if (expandType === d.expandTriggerArr[i]) {
//         return "expand";
//       }
//     }

//     //MIGHT NOT BE NEEDED
//     for (let i = 0; i < d.inputTriggerArr.length; i++) {
//       if (inputId === d.inputTriggerArr[i]) {
//         return "input";
//       }
//     }

//     return null;
//   };
