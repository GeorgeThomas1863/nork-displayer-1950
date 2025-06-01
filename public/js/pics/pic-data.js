import { buildInputParams, sendToBack } from "../util.js";

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
