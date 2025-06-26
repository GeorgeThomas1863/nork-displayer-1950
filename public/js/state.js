import d from "./define-things.js";
import { buildInputParams } from "./util.js";

export const state = {
  route: "/get-backend-data-route",
  isFirstLoad: true,
  dataType: "articles",
  articleType: "fatboy",

  //data already requested
  trigger: null,
  dataReq: d.defaultInputMap,
  dataLoaded: d.defaultDataLoadedMap,
};

//IN responsive / click listener
export const checkChangeTriggered = async (changeId) => {
  const { changeTriggerArr } = d;
  // console.log("CHANGE ID");
  // console.log(changeId);

  for (let i = 0; i < changeTriggerArr.length; i++) {
    const changeItem = changeTriggerArr[i];

    //change event NOT found
    if (changeId !== changeItem) continue;

    //otherwise event triggered
    return changeItem;
  }

  return null;
};

export const checkInputTriggered = async (inputId) => {
  const { inputTriggerArr } = d;
  // console.log("INPUT ID");
  // console.log(inputId);

  for (let i = 0; i < inputTriggerArr.length; i++) {
    const inputItem = inputTriggerArr[i];

    //change event NOT found
    if (inputId !== inputItem) continue;

    //otherwise event triggered
    return inputItem;
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
  for (let i = 0; i < inputArray.length; i++) {
    const inputItem = inputArray[i];
    const { dataType, dataArray } = inputItem;
    const { dataLoaded } = state;

    //UPDATE JUST THE INDIVIDUAL ITEM
    for (let k in dataLoaded) {
      if (!dataType || dataType !== k) continue;

      const numberLoaded = dataArray?.length || 0;
      state.dataLoaded[k] = numberLoaded;
    }
  }

  state.isFirstLoad = false;

  return true;
};

//basically return true except for how many
export const checkNewDataNeeded = async () => {
  const { isFirstLoad, dataReq, dataLoaded, dataType, trigger } = state;

  if (isFirstLoad) return true;

  //return true on all sorts / article changes (just assume not loaded)
  if (trigger.includes("sort-by") || trigger === "article-type") return true;

  //check how many
  const itemsLoaded = dataLoaded[dataType];
  const prefix = dataType.substring(0, dataType.length - 1);
  const itemsNeeded = dataReq[`${prefix}HowMany`];

  if (itemsNeeded > itemsLoaded) return true;

  return null;
};

export const checkHideUnhideData = async () => {}
