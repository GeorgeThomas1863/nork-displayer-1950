import { buildVidPageListItem } from "./vid-elements.js";
import { defineCollapseItems } from "../collapse.js";

//VID PAGE DISPLAY
export const buildDefaultVidPageDisplay = async (inputArray, stateParams = null) => {
  if (!inputArray || !inputArray.length) return null;

  const vidPageList = document.createElement("ul");
  vidPageList.id = "vid-page-array-element";
  vidPageList.className = "hidden";

  //set state params
  if (stateParams) {
    //state params from user input
    setCurrentVidPageState(vidPageList, stateParams);
  } else {
    //handle initial load
    const defaultStateParams = ["vid-pages", 5, "vid-newest-to-oldest"];
    setCurrentVidPageState(vidPageList, defaultStateParams);
  }

  let isFirst = true;
  const collapseArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    const vidPageListItem = await buildVidPageListItem(inputArray[i], isFirst);
    vidPageList.appendChild(vidPageListItem);

    // Store the collapse components for group functionality
    const collapseItem = vidPageListItem.querySelector(".collapse-container");
    if (collapseItem) collapseArray.push(collapseItem);

    isFirst = false;
  }

  // Set up the collapse group behavior
  await defineCollapseItems(collapseArray);

  return vidPageList;
};

export const buildNewVidPageDisplay = async () => {};

// Helper function to get current vid state from DOM element
export const getCurrentVidPageState = (vidElement) => {
  // if (!vidElement) {
  //   // If no element exists, return initial default state
  //   return ["vid-alone", 3, "vid-newest-to-oldest"];
  // }
  // const vidType = vidElement.getAttribute("data-vid-type") || "vid-alone";
  // const vidHowMany = parseInt(vidElement.getAttribute("data-vid-how-many")) || 3;
  // const vidSortBy = vidElement.getAttribute("data-vid-sort-by") || "vid-newest-to-oldest";
  // return [vidType, vidHowMany, vidSortBy];
};

// Helper function to store current vid state on DOM element
export const setCurrentVidPageState = (vidElement, inputArray) => {
  // if (!vidElement || !inputArray || inputArray.length < 3) return;
  // const [vidType, vidHowMany, vidSortBy] = inputArray;
  // vidElement.setAttribute("data-vid-type", vidType);
  // vidElement.setAttribute("data-vid-how-many", vidHowMany.toString());
  // vidElement.setAttribute("data-vid-sort-by", vidSortBy);
};
