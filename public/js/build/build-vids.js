import { buildCollapseContainer } from "../collapse.js";
import { buildInputParams, sendToBack } from "../util.js";

export const buildVidForm = async () => {
  const vidWrapper = document.createElement("ul");
  vidWrapper.id = "vid-wrapper";
  vidWrapper.className = "wrapper collapse-content";

  const vidTypeListItem = await buildVidTypeListItem();
  const vidHowManyListItem = await buildVidHowManyListItem();
  const vidSortByListItem = await buildVidSortByListItem();

  vidWrapper.append(vidTypeListItem, vidHowManyListItem, vidSortByListItem);

  const titleElement = document.createElement("div");
  titleElement.textContent = "VIDEOS";
  // titleElement.setAttribute("data-expand", "vid-dropdown"); //for click listener

  //build collapse container
  const vidCollapseObj = {
    titleElement: titleElement,
    contentElement: vidWrapper,
    isExpanded: false,
    className: "vid-wrapper-collapse",
    dataAttribute: "vid-form-header",
  };

  const vidCollapseContainer = await buildCollapseContainer(vidCollapseObj);

  // Apply the wrapper class to the collapse container instead
  vidCollapseContainer.className = "wrapper";

  return vidCollapseContainer;
};

export const buildVidTypeListItem = async () => {
  const vidTypeListItem = document.createElement("li");
  vidTypeListItem.id = "vid-type-list-item";
  vidTypeListItem.className = "form";

  const vidTypeLabel = document.createElement("label");
  vidTypeLabel.setAttribute("for", "vid-type");
  vidTypeLabel.textContent = "Video Type";

  const vidTypeSelect = document.createElement("select");
  vidTypeSelect.name = "vid-type";
  vidTypeSelect.id = "vid-type";

  // Create options for article type select
  const optionArray = [
    { value: "vid-alone", id: "vid-alone", text: "Just Vids", selected: true },
    { value: "vid-pages", id: "vid-pages", text: "Vid Pages" },
  ];

  for (let i = 0; i < optionArray.length; i++) {
    const optionData = optionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.id = optionData.id;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    vidTypeSelect.append(option);
  }

  vidTypeListItem.append(vidTypeLabel, vidTypeSelect);

  return vidTypeListItem;
};

export const buildVidHowManyListItem = async () => {
  const vidHowManyListItem = document.createElement("li");
  vidHowManyListItem.id = "vid-how-many-list-item";
  vidHowManyListItem.className = "form";

  const vidHowManyLabel = document.createElement("label");
  vidHowManyLabel.setAttribute("for", "vid-how-many");
  vidHowManyLabel.textContent = "How Many?";

  const vidHowManyInput = document.createElement("input");
  vidHowManyInput.type = "text";
  vidHowManyInput.name = "vid-how-many";
  vidHowManyInput.id = "vid-how-many";
  vidHowManyInput.placeholder = "[Defaults to 3 (most recent)]";

  vidHowManyListItem.append(vidHowManyLabel, vidHowManyInput);

  return vidHowManyListItem;
};

export const buildVidSortByListItem = async () => {
  const vidSortByListItem = document.createElement("li");
  vidSortByListItem.id = "vid-sort-by-list-item";
  vidSortByListItem.className = "form";

  const vidSortByLabel = document.createElement("label");
  vidSortByLabel.setAttribute("for", "vid-sort-by");
  vidSortByLabel.textContent = "Sort By";

  const vidSortBySelect = document.createElement("select");
  vidSortBySelect.name = "vid-sort-by";
  vidSortBySelect.id = "vid-sort-by";

  // Create options for sort by select
  const optionArray = [
    { value: "vid-newest-to-oldest", id: "vid-newest-to-oldest", text: "Newest to Oldest", selected: true },
    { value: "vid-oldest-to-newest", id: "vid-oldest-to-newest", text: "Oldest to Newest" },
  ];

  for (let i = 0; i < optionArray.length; i++) {
    const optionData = optionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.id = optionData.id;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    vidSortBySelect.append(option);
  }

  vidSortByListItem.append(vidSortByLabel, vidSortBySelect);

  return vidSortByListItem;
};

//----------------------------

export const buildVidDataDisplay = async (inputArray, stateParams = null) => {
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

export const buildVidPageDataDisplay = async (inputArray, stateParams = null) => {
  if (!inputArray || !inputArray.length) return null;

  console.log("BUILD VID PAGES DISPLAY");

  // const vidList = document.createElement("ul");
  // vidList.id = "vid-array-element";
  // vidList.className = "hidden";

  // //set state params
  // if (stateParams) {
  //   //state params from user input
  //   setCurrentVidState(vidList, stateParams);
  // } else {
  //   //handle initial load
  //   const defaultStateParams = ["vid-alone", 3, "vid-newest-to-oldest"];
  //   setCurrentVidState(vidList, defaultStateParams);
  // }

  // for (let i = 0; i < inputArray.length; i++) {
  //   //SHOULD DETERMINE HERE IF VID PAGE OR VID ALONE
  //   const vidListItem = await buildVidListItem(inputArray[i]);
  //   if (!vidListItem) continue;

  //   vidList.appendChild(vidListItem);
  // }

  return null;
};

export const buildVidListItem = async (inputObj) => {
  if (!inputObj || !inputObj.savePath) return null;
  const { savePath } = inputObj;

  const vidListItem = document.createElement("li");
  vidListItem.id = "vid-list-item";

  //ADD pic stats here (scrape date, server, size, etc)

  const vidElement = await buildVidElement(savePath);
  vidListItem.append(vidElement);

  return vidListItem;
};

export const buildVidElement = async (savePath) => {
  if (!savePath) return null;

  const vidElement = document.createElement("video");
  vidElement.id = "vid-element";
  vidElement.controls = true;

  const sourceElement = document.createElement("source");
  const fileName = savePath.split("/").pop();
  const vidPath = "/kcna-vids/" + fileName;

  sourceElement.src = vidPath;
  sourceElement.type = "video/mp4";

  vidElement.appendChild(sourceElement);

  return vidElement;
};

//----------------------------------

//GET NEW PIC DATA

export const getNewVidData = async () => {
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

  const newVidDataWrapper = await buildVidData(newVidData, newVidInputArray);
  // if (!newVidDataWrapper) return null;
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
const getCurrentVidState = (vidElement) => {
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
const setCurrentVidState = (vidElement, inputArray) => {
  if (!vidElement || !inputArray || inputArray.length < 3) return;

  const [vidType, vidHowMany, vidSortBy] = inputArray;

  vidElement.setAttribute("data-vid-type", vidType);
  vidElement.setAttribute("data-vid-how-many", vidHowMany.toString());
  vidElement.setAttribute("data-vid-sort-by", vidSortBy);
};
