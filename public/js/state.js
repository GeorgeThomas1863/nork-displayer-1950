import d from "./define-things.js";
import { buildInputParams } from "./util.js";

export const state = {
  route: "/get-backend-data-route",
  isFirstLoad: true,
  dataType: "articles",
  articleType: "fatboy",

  //data already requested
  dataReq: d.defaultInputMap,
  dataLoaded: null,
  trigger: null,
};

//IN responsive / click listener
export const checkEventTriggered = async (changeId) => {
  const { changeTriggerArr } = d;
  console.log("CHANGE ID");
  console.log(changeId);

  for (let i = 0; i < changeTriggerArr.length; i++) {
    const changeItem = changeTriggerArr[i];

    //change event NOT found
    if (changeId !== changeItem) continue;

    //otherwise event triggered
    return changeItem;
  }

  return null;
};

export const updateStateEventTriggered = async (changeId, eventTriggered) => {
  //get data to update
  const inputParams = await buildInputParams();
  const newType = d.triggerTypeMap(changeId);
  const newArticleType = document.getElementById("article-type").value;

  //update state obj
  state.trigger = eventTriggered;
  state.dataReq = inputParams;
  state.dataType = newType;
  state.articleType = newArticleType;
};

//FUCKED, FIGURE OUT BELOW

//MAKE MUCH MORE COMPLEX
export const updateStateDataLoaded = async (inputArray) => {
  const { isFirstLoad, dataLoaded } = state;

  //if not first load only update one thing
  // if (!isFirstLoad) {
  //   const updateItem = inputArray[0];s
  //   const { dataType, dataArray } = updateItem;

  //   dataLoaded[dataType] = dataArray.length;
  //   return true;
  // }

  //update data loop (will be 1 item if not first load)
  const returnObj = {};
  for (let i = 0; i < inputArray.length; i++) {
    const inputItem = inputArray[i];
    const { dataType, dataArray } = inputItem;

    const numberLoaded = dataArray.length;
    returnObj[dataType] = numberLoaded;
  }

  dataLoaded = returnObj;
  isFirstLoad = false;

  console.log("DATA LOADED STATE");
  console.dir(state);

  return returnObj;
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
