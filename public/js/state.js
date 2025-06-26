import d from "./define-things.js";
import { buildInputParams } from "./util.js";

export const state = {
  route: "/get-backend-data-route",
  isFirstLoad: true,
  dataType: "articles",
  articleType: null,

  //data already requested
  dataReq: d.defaultInputMap,
  dataLoaded: null,
  trigger: null,
};

//MAKE MUCH MORE COMPLEX
export const updateDataLoaded = async (inputArray) => {
  const { isFirstLoad, dataLoaded, dataType } = state;

  //if not first load only update one thing
  if (!isFirstLoad) {
    const updateItem = inputArray[0];
    const { dataType, dataArray } = updateItem;

    dataLoaded[dataType] = dataArray.length;
    return true;
  }

  //otherwise first load, update all types
  const returnObj = {};
  for (let i = 0; i < inputArray.length; i++) {
    const inputItem = inputArray[i];
    const { dataType, dataArray } = inputItem;

    console.log("UPDATE DATA TYPE");
    console.log(dataType);

    //add in article type here
    if (dataType === "articles") {
      console.log("AHHHHHHHHHH");
      state.articleType = articleType;
    }

    const numberLoaded = dataArray.length;
    returnObj[dataType] = numberLoaded;
  }

  state.dataLoaded = returnObj;
  state.isFirstLoad = false;
  return true;
};

export const checkEventTriggered = async (changeId) => {
  const { changeTriggerArr } = d;
  console.log("CHANGE ID");
  console.log(changeId);

  for (let i = 0; i < changeTriggerArr.length; i++) {
    const changeItem = changeTriggerArr[i];

    //change event NOT found
    if (changeId !== changeItem) continue;

    //otherwise change event triggered, update dataType first
    const newType = d.triggerTypeMap(changeId);
    state.dataType = newType;
    return changeItem;
  }

  return null;
};

//basically return true except for how many
export const checkNewDataNeeded = async () => {
  const { isFirstLoad, dataReq, dataLoaded, trigger } = state;

  // console.log("STATE");
  // console.dir(state);

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
