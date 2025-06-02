import { setCurrentPicState } from "./pic-data.js";
import { buildCollapseContainer, defineCollapseItems } from "../collapse.js";
import { picDropDownContainer } from "./pic-util.js";

//PIC SET DISPLAY
export const buildDefaultPicSetDisplay = async (inputArray, stateParams = null) => {
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

export const buildNewPicSetDisplay = async () => {};
