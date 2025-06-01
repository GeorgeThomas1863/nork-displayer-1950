import { buildCollapseContainer } from "../collapse.js";
import { buildInputParams, sendToBack } from "../util.js";

export const buildPicForm = async () => {
  const picWrapper = document.createElement("ul");
  picWrapper.id = "pic-wrapper";
  picWrapper.className = "wrapper collapse-content";

  const titleElement = document.createElement("div");
  titleElement.textContent = "PICS";
  // titleElement.setAttribute("data-expand", "pic-dropdown"); //for click listener

  const picTypeListItem = await buildPicTypeListItem();
  const picHowManyListItem = await buildPicHowManyListItem();
  const picSortByListItem = await buildPicSortByListItem();

  picWrapper.append(picTypeListItem, picHowManyListItem, picSortByListItem);

  //build collapse container
  const picCollapseObj = {
    titleElement: titleElement,
    contentElement: picWrapper,
    isExpanded: true,
    className: "pic-wrapper-collapse",
    dataAttribute: "pic-form-header",
  };

  const picCollapseContainer = await buildCollapseContainer(picCollapseObj);

  // Apply the wrapper class to the collapse container instead
  picCollapseContainer.className = "wrapper";

  return picCollapseContainer;
};

export const buildPicTypeListItem = async () => {
  const picTypeListItem = document.createElement("li");
  picTypeListItem.id = "pic-type-list-item";
  picTypeListItem.className = "form";

  const picTypeLabel = document.createElement("label");
  picTypeLabel.setAttribute("for", "pic-type");
  picTypeLabel.textContent = "Pic Type";

  const picTypeSelect = document.createElement("select");
  picTypeSelect.name = "pic-type";
  picTypeSelect.id = "pic-type";

  // Create options for article type select
  const optionArray = [
    { value: "pic-alone", id: "pic-alone", text: "Just Pics", selected: true },
    { value: "pic-sets", id: "pic-sets", text: "Pic Sets" },
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
    picTypeSelect.append(option);
  }

  picTypeListItem.append(picTypeLabel, picTypeSelect);

  return picTypeListItem;
};

export const buildPicHowManyListItem = async () => {
  const picHowManyListItem = document.createElement("li");
  picHowManyListItem.id = "pic-how-many-list-item";
  picHowManyListItem.className = "form";

  const picHowManyLabel = document.createElement("label");
  picHowManyLabel.setAttribute("for", "pic-how-many");
  picHowManyLabel.textContent = "How Many?";

  const picHowManyInput = document.createElement("input");
  picHowManyInput.type = "text";
  picHowManyInput.name = "pic-how-many";
  picHowManyInput.id = "pic-how-many";
  picHowManyInput.placeholder = "[Defaults to 9 (most recent)]";

  picHowManyListItem.append(picHowManyLabel, picHowManyInput);

  return picHowManyListItem;
};

export const buildPicSortByListItem = async () => {
  const picSortByListItem = document.createElement("li");
  picSortByListItem.id = "pic-sort-by-list-item";
  picSortByListItem.className = "form";

  const picSortByLabel = document.createElement("label");
  picSortByLabel.setAttribute("for", "pic-sort-by");
  picSortByLabel.textContent = "Sort By";

  const picSortBySelect = document.createElement("select");
  picSortBySelect.name = "pic-sort-by";
  picSortBySelect.id = "pic-sort-by";

  // Create options for sort by select
  const optionArray = [
    { value: "pic-newest-to-oldest", id: "pic-newest-to-oldest", text: "Newest to Oldest", selected: true },
    { value: "pic-oldest-to-newest", id: "pic-oldest-to-newest", text: "Oldest to Newest" },
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
    picSortBySelect.append(option);
  }

  picSortByListItem.append(picSortByLabel, picSortBySelect);

  return picSortByListItem;
};

//----------------------------------

//FOR PIC ALONE
export const buildPicData = async (inputArray, stateParams = null) => {
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
    //SHOULD DETERMINE HERE IF PIC SET OR PIC ALONE
    const picListItem = await buildPicListItem(inputArray[i]);
    if (!picListItem) continue;

    picList.appendChild(picListItem);
  }

  return picList;
};

//BUILD PIC SET PARSE HERE
export const buildPicSetData = async (inputArray, stateParams = null) => {
  console.log("AHHHHHH");
  console.log("FUCKING BUILD");
  console.log(inputArray);

  return null;
};

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

//PARSE PIC ITEMS

export const buildPicList = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = document.createElement("ul");
  picArrayElement.id = "pic-list-element";

  for (let i = 0; i < inputArray.length; i++) {
    const picListItem = await buildPicListItem(inputArray[i]);
    if (!picListItem) continue;

    picArrayElement.append(picListItem);
  }

  return picArrayElement;
};

export const buildPicListItem = async (inputObj) => {
  if (!inputObj || !inputObj.savePath) return null;
  const { savePath } = inputObj;

  const picListItem = document.createElement("li");
  picListItem.id = "pic-list-item";

  //build pic / stat elements
  const picElement = await buildPicElement(savePath);
  const picStatsElement = await buildPicStatsElement(inputObj);

  picListItem.append(picElement, picStatsElement);

  return picListItem;
};

//build pic itself
export const buildPicElement = async (savePath) => {
  if (!savePath) return null;

  const picElement = document.createElement("img");
  picElement.id = "pic-element";

  //define pic path
  const fileName = savePath.split("/").pop();
  const picPath = "/kcna-pics/" + fileName;

  picElement.src = picPath;
  picElement.alt = "KCNA PIC";

  return picElement;
};

//build pic stats
export const buildPicStatsElement = async (inputObj) => {
  if (!inputObj) return null;
  const { picDate, picSource, headerData } = inputObj;

  // console.log("INPUT OBJ");
  // console.log(inputObj);

  const picStatsElement = document.createElement("div");
  picStatsElement.id = "pic-stats";

  const picDateElement = await buildPicDateElement(picDate);
  const picSourceElement = await buildPicSourceElement(picSource);
  const picServerElement = await buildPicServerElement(headerData);

  picStatsElement.append(picDateElement, picSourceElement, picServerElement);

  return picStatsElement;
};

//extract / format pic date
export const buildPicDateElement = async (picDate) => {
  if (!picDate) return null;

  const dateElement = document.createElement("div");
  dateElement.id = "pic-date";
  const dateObj = new Date(picDate);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  dateElement.innerHTML = `<b>Date:</b> ${formattedDate}`;

  return dateElement;
};

//calc where pic from (do on backend)
export const buildPicSourceElement = async (picSource) => {
  if (!picSource) return null;

  const picSourceElement = document.createElement("div");
  picSourceElement.id = "pic-source";
  picSourceElement.innerHTML = `<b>Pic From:</b> ${picSource}`;

  return picSourceElement;
};

//EXTRACT PIC SERVER DATA
export const buildPicServerElement = async (headerData) => {
  if (!headerData || !headerData.server) return null;
  const serverData = headerData.server;

  const picServerElement = document.createElement("div");
  picServerElement.id = "pic-server";
  picServerElement.innerHTML = `<b>Server Data:</b> ${serverData}`;

  return picServerElement;
};

//----------------------------------

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
    newPicDataWrapper = await buildPicSetData(newPicData, newPicInputArray);
  } else {
    newPicDataWrapper = await buildPicData(newPicData, newPicInputArray);
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
