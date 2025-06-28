import d from "./define-things.js";
import { state } from "./state.js";

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

export const checkHideUnhideData = async () => {
  const { dataType, dataLoaded, dataReq } = state;

  // console.log("AHHHHHHHHHHHHHH");
  // console.log("!!!STATE", state);

  const itemsLoaded = dataLoaded[dataType];
  const prefix = dataType.substring(0, dataType.length - 1);
  const itemsNeeded = dataReq[`${prefix}HowMany`];

  if (itemsNeeded === itemsLoaded) return null;
  const itemsToHide = itemsNeeded.length - itemsLoaded.length;

  //get things to hide / unhide
  const listItemArray = document.querySelectorAll(`.${prefix}-list-item`);

  //unhide entire array
  await unhideArray(listItemArray);

  //negative so last ones are hidden
  const itemsToHideArray = listItemArray.slice(-itemsToHide);

  console.log("!!!ITEMS TO HIDE ARRAY");
  console.log(itemsToHideArray);

  await hideArray(itemsToHideArray);

  return true;

  // console.log("!!!LIST ITEM ARRAY");
  // console.log(listItemArray);
};
