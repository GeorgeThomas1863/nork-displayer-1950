import { setCurrentVidState } from "./vid-data.js";

//VID ALONE DISPLAY
export const buildDefaultVidDisplay = async (inputArray, stateParams = null) => {
  if (!inputArray || !inputArray.length) return null;

  const vidList = document.createElement("ul");
  vidList.id = "vid-array-element";
  vidList.className = "hidden";

  //set state params
  if (stateParams) {
    //state params from user input
    setCurrentVidState(vidList, stateParams);
  } else {
    //handle initial load
    const defaultStateParams = ["vid-alone", 3, "vid-newest-to-oldest"];
    setCurrentVidState(vidList, defaultStateParams);
  }

  for (let i = 0; i < inputArray.length; i++) {
    //SHOULD DETERMINE HERE IF VID PAGE OR VID ALONE
    const vidListItem = await buildVidListItem(inputArray[i]);
    if (!vidListItem) continue;

    vidList.appendChild(vidListItem);
  }

  return vidList;
};

export const buildNewVidDisplay = async () => {
  //get user input
  const inputParams = await buildInputParams();
  if (!inputParams || !inputParams.vidType || !inputParams.vidHowMany || !inputParams.vidSortBy) return null;

  // Extract article inputs
  const { vidType, vidHowMany, vidSortBy } = inputParams;
  const newVidInputArray = [vidType, vidHowMany, vidSortBy];

  // Get current data state from the existing article array element
  const vidArrayElement = document.getElementById("vid-array-element");
  const currentVidInputArray = getCurrentVidState(vidArrayElement);

  // Compare new input against current state, not hardcoded defaults
  let needsNewData = false;
  for (let i = 0; i < currentVidInputArray.length; i++) {
    if (currentVidInputArray[i] !== newVidInputArray[i]) {
      needsNewData = true;
      break;
    }
  }

  // If no change needed, return early
  if (!needsNewData) {
    console.log("Vid data unchanged, skipping backend request");
    console.log("Current state:", currentVidInputArray);
    console.log("New input:", newVidInputArray);
    return false;
  }

  console.log("Vid parameters changed - fetching new data");
  console.log("Previous state:", currentVidInputArray);
  console.log("New state:", newVidInputArray);

  //set route and fetch new data
  inputParams.route = "/get-new-vid-data-route";
  const newVidData = await sendToBack(inputParams);

  if (!newVidData) return null;

  let newVidDataWrapper = "";
  if (vidType === "vid-pages") {
    newVidDataWrapper = await buildVidPageDisplay(newVidData, newVidInputArray);
  } else {
    newVidDataWrapper = await buildVidDisplay(newVidData, newVidInputArray);
  }
  newVidDataWrapper.classList.remove("hidden");

  //get backend data wrapper and replace old data
  const backendDataWrapper = document.getElementById("backend-data-wrapper");

  //replace old data with new data (newPicDataWrapper) on display element
  backendDataWrapper.replaceChild(newVidDataWrapper, vidArrayElement);

  console.log("BACKEND DATA WRAPPER");
  console.log(backendDataWrapper);

  return true;
};

// Helper function to get current vid state from DOM element
export const getCurrentVidState = (vidElement) => {
  if (!vidElement) {
    // If no element exists, return initial default state
    return ["vid-alone", 3, "vid-newest-to-oldest"];
  }

  const vidType = vidElement.getAttribute("data-vid-type") || "vid-alone";
  const vidHowMany = parseInt(vidElement.getAttribute("data-vid-how-many")) || 3;
  const vidSortBy = vidElement.getAttribute("data-vid-sort-by") || "vid-newest-to-oldest";

  return [vidType, vidHowMany, vidSortBy];
};

// Helper function to store current vid state on DOM element
export const setCurrentVidState = (vidElement, inputArray) => {
  if (!vidElement || !inputArray || inputArray.length < 3) return;

  const [vidType, vidHowMany, vidSortBy] = inputArray;

  vidElement.setAttribute("data-vid-type", vidType);
  vidElement.setAttribute("data-vid-how-many", vidHowMany.toString());
  vidElement.setAttribute("data-vid-sort-by", vidSortBy);
};
