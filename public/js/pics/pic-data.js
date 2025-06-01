import { buildPicListItem, buildPicSetListItem, buildPicList } from "./pic-elements.js";
import { buildCollapseContainer, defineCollapseItems } from "../collapse.js";
import { buildInputParams, sendToBack } from "../util.js";

//PIC ALONE DISPLAY
export const buildPicDisplay = async (inputArray, stateParams = null) => {
  if (!inputArray || !inputArray.length) return null;

  const picList = document.createElement("ul");
  picList.id = "pic-array-element";
  // picList.className = "hidden";

  //set state params
  if (stateParams) {
    //state params from user input
    setCurrentPicState(picList, stateParams);
  } else {
    //handle initial load
    const defaultStateParams = ["pic-alone", 9, "pic-newest-to-oldest"];
    setCurrentPicState(picList, defaultStateParams);
  }

  for (let i = 0; i < inputArray.length; i++) {
    const picListItem = await buildPicListItem(inputArray[i]);
    if (!picListItem) continue;

    picList.appendChild(picListItem);
  }

  return picList;
};

//PIC SET DISPLAY
export const buildPicSetDisplay = async (inputArray, stateParams = null) => {
  if (!inputArray || !inputArray.length) return null;

  const picSetList = document.createElement("ul");
  picSetList.id = "pic-set-array-element";
  picSetList.className = "hidden";

  //set state params
  if (stateParams) {
    //state params from user input
    setCurrentPicState(picSetList, stateParams);
  } else {
    //handle initial load
    const defaultStateParams = ["pic-sets", 5, "pic-newest-to-oldest"];
    setCurrentPicState(picSetList, defaultStateParams);
  }

  let isFirst = true;
  const collapseArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    const picSetListItem = await buildPicSetListItem(inputArray[i], isFirst);
    picSetList.appendChild(picSetListItem);

    // Store the collapse components for group functionality
    const collapseItem = picSetListItem.querySelector(".collapse-container");
    if (collapseItem) collapseArray.push(collapseItem);

    isFirst = false;
  }

  // Set up the collapse group behavior
  await defineCollapseItems(collapseArray);

  return picSetList;
};

//---------------------------------------

export const buildArticlePicData = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = await buildPicList(inputArray);
  if (!picArrayElement) return null;

  //build pic title element
  const picTitleElement = document.createElement("div");
  picTitleElement.id = "article-pic-header";
  picTitleElement.textContent = `${inputArray.length} ARTICLE PIC${inputArray.length > 1 ? "S" : ""}`;

  //build collapse container
  const picCollapseObj = {
    titleElement: picTitleElement,
    contentElement: picArrayElement,
    isExpanded: true,
    className: "article-pic-collapse",
  };

  const picCollapseElement = await buildCollapseContainer(picCollapseObj);

  return picCollapseElement;
};

//------------------------

//GET NEW PIC DATA

export const getNewPicData = async () => {
  //get user input
  const inputParams = await buildInputParams();
  if (!inputParams || !inputParams.picType || !inputParams.picHowMany || !inputParams.picSortBy) return null;

  // Extract article inputs
  const { picType, picHowMany, picSortBy } = inputParams;
  const newPicInputArray = [picType, picHowMany, picSortBy];

  // Get current data state from the existing article array element
  const picArrayElement = document.getElementById("pic-array-element");
  const currentPicInputArray = getCurrentPicState(picArrayElement);

  // Compare new input against current state, not hardcoded defaults
  let needsNewData = false;
  for (let i = 0; i < currentPicInputArray.length; i++) {
    if (currentPicInputArray[i] !== newPicInputArray[i]) {
      needsNewData = true;
      break;
    }
  }

  // If no change needed, return early
  if (!needsNewData) {
    console.log("Pic data unchanged, skipping backend request");
    console.log("Current state:", currentPicInputArray);
    console.log("New input:", newPicInputArray);
    return false;
  }

  console.log("Pic parameters changed - fetching new data");
  console.log("Previous state:", currentPicInputArray);
  console.log("New state:", newPicInputArray);

  //set route and fetch new data
  inputParams.route = "/get-new-pic-data-route";
  const newPicData = await sendToBack(inputParams);

  if (!newPicData) return null;

  let newPicDataWrapper = "";
  if (picType === "pic-sets") {
    newPicDataWrapper = await buildPicSetDisplay(newPicData, newPicInputArray);
  } else {
    newPicDataWrapper = await buildPicDisplay(newPicData, newPicInputArray);
  }
  newPicDataWrapper.classList.remove("hidden");

  //get backend data wrapper and replace old data
  const backendDataWrapper = document.getElementById("backend-data-wrapper");

  //replace old data with new data (newPicDataWrapper) on display element
  backendDataWrapper.replaceChild(newPicDataWrapper, picArrayElement);

  // console.log("BACKEND DATA WRAPPER");
  // console.log(backendDataWrapper);

  return true;
};

// Helper function to get current pic state from DOM element
const getCurrentPicState = (picElement) => {
  if (!picElement) {
    // If no element exists, return initial default state
    return ["pic-alone", 9, "pic-newest-to-oldest"];
  }

  const picType = picElement.getAttribute("data-pic-type") || "pic-alone";
  const picHowMany = parseInt(picElement.getAttribute("data-pic-how-many")) || 9;
  const picSortBy = picElement.getAttribute("data-pic-sort-by") || "pic-newest-to-oldest";

  return [picType, picHowMany, picSortBy];
};

// Helper function to store current pic state on DOM element
const setCurrentPicState = (picElement, inputArray) => {
  if (!picElement || !inputArray || inputArray.length < 3) return;

  const [picType, picHowMany, picSortBy] = inputArray;

  picElement.setAttribute("data-pic-type", picType);
  picElement.setAttribute("data-pic-how-many", picHowMany.toString());
  picElement.setAttribute("data-pic-sort-by", picSortBy);
};
