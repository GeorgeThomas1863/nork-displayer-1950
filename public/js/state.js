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

//!!!!HERE!!!!!

//MAKE MUCH MORE COMPLEX
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
    const changeItem = changeTriggerArr[i];
    if (changeId === changeItem) return changeItem;
  }

  return null;
};

//basically return true except for how many
export const checkNewDataNeeded = async () => {
  const { isFirstLoad, dataReq, dataLoaded, trigger } = state;

  if (isFirstLoad) return true;

  //return true on all sorts (just assume not loaded)
  if (trigger.includes("sort-by")) return true;

  switch (trigger) {
    case "pic-type":
      const { pics, picSets } = dataLoaded;
      const { picType, picHowMany } = dataReq;

      switch (picType) {
        case "pic-alone":
          if (pics >= picHowMany) return null;
          return true;
        case "pic-sets":
          if (picSets >= picHowMany) return null;
          return true;
      }

    case "vid-type":
      const { vids, vidPages } = dataLoaded;
      const { vidType, vidHowMany } = dataReq;

      switch (vidType) {
        case "vid-alone":
          if (vids >= vidHowMany) return null;
          return true;
        case "vid-pages":
          if (vidPages >= vidHowMany) return null;
          return true;
      }

    //MAKE ARTICLE LOGIC DEAL WITH ARTICLE TYPE
    case "article-type":
      return true;
  }

  return null;
};

// export const newDataTrigger = async () => {
//   const { isFirstLoad, dataReq } = state;

//   //trigger new data on first load
//   if (isFirstLoad) return true;

//   const inputParams = await buildInputParams();
//   // const defaultParams = d.defaultInputMap;

//   // console.log("!!!!!!!DEFAULT PARAMS");
//   // console.dir(defaultParams);

//   for (let k in dataReq) {
//     const defaultItem = dataReq[k];
//     const inputItem = inputParams[k];

//     //pass condition
//     if (defaultItem === inputItem) continue;

//     const moreDataNeeded = await checkMoreDataNeeded(k, inputItem);
//     if (!moreDataNeeded) continue;

//     // console.log("k");
//     // console.log(k);

//     //trigger new data, set the dataReq first
//     // state.dataReq = inputParams;
//     // state.trigger = k;
//     // console.log("STATE");
//     // console.dir(state);
//     return true;
//   }

//   return false;
// };s
