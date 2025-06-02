import { buildVidElement } from "./vid-return-alone.js";
import { defineCollapseItems, buildCollapseContainer } from "../collapse.js";
import { setCurrentVidState } from "./vid-data.js";

//VID PAGE DISPLAY
export const buildDefaultVidPageDisplay = async (inputArray, stateParams = null) => {
  if (!inputArray || !inputArray.length) return null;

  const vidPageList = document.createElement("ul");
  vidPageList.id = "vid-page-array-element";
  vidPageList.className = "hidden";

  //set state params
  if (stateParams) {
    //state params from user input
    setCurrentVidState(vidPageList, stateParams);
  } else {
    //handle initial load
    const defaultStateParams = ["vid-pages", 5, "vid-newest-to-oldest"];
    setCurrentVidState(vidPageList, defaultStateParams);
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
