import { buildCollapseContainer, defineCollapseItems } from "../util/collapse-display.js";
import stateFront from "../util/state-front.js";

export const buildPicsReturnDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;
  const { picType } = stateFront;

  const picDisplayContainer = document.createElement("div");
  picDisplayContainer.id = "pic-display-container";

  //append the buttons first
  const picTypeButtons = await buildPicTypeButtons();
  picDisplayContainer.append(picTypeButtons);

  let data = "";
  switch (picType) {
    case "all":
      data = await buildPicsAllDisplay(inputArray);
      break;

    case "picSets":
      data = await buildPicSetsDisplay(inputArray);
      break;

    default:
      return null;
  }

  picDisplayContainer.append(data);

  return picDisplayContainer;
};

export const buildPicTypeButtons = async () => {
  const picTypeButtonContainer = document.createElement("div");
  picTypeButtonContainer.id = "pic-type-button-container";
  picTypeButtonContainer.className = "button-type-container";

  // Define button data matching your dropdown options
  const buttonData = [
    { buttonValue: "all", buttonText: "All Pics" },
    { buttonValue: "picSets", buttonText: "Pic Sets" },
  ];

  // Create button list
  const buttonList = document.createElement("ul");
  buttonList.id = "pic-type-button-list";
  buttonList.className = "button-type-list";

  // Build each button
  for (let i = 0; i < buttonData.length; i++) {
    const buttonItem = await buildPicTypeButtonItem(buttonData[i]);
    buttonList.append(buttonItem);
  }

  picTypeButtonContainer.append(buttonList);
  return picTypeButtonContainer;
};

export const buildPicTypeButtonItem = async (buttonData) => {
  const { picType } = stateFront;
  const { buttonValue, buttonText } = buttonData;

  const buttonListItem = document.createElement("li");
  buttonListItem.className = "button-type-list-item";

  const button = document.createElement("button");
  button.id = `pic-type-button-${buttonValue}`;
  button.className = "button-type-item";
  button.setAttribute("data-update", `pic-type-button-${buttonValue}`);
  button.innerHTML = buttonText;

  //add active type
  if (picType === buttonValue) button.classList.add("active");

  buttonListItem.append(button);
  return buttonListItem;
};

//--------------------

export const buildPicsAllDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picAllWrapper = document.createElement("ul");
  picAllWrapper.id = "pic-all-wrapper";

  const picArrayElement = await buildPicWrapper(inputArray);
  if (!picArrayElement) return null;

  picAllWrapper.append(picArrayElement);

  return picAllWrapper;
};

//PIC SET DISPLAY
export const buildPicSetsDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = document.createElement("ul");
  picArrayElement.id = "pic-array-element";

  let isFirst = true;
  const collapseArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    const picListItem = await buildPicListItem(inputArray[i], isFirst);
    picArrayElement.appendChild(picListItem);

    // Store the collapse components for group functionality
    const collapseItem = picListItem.querySelector(".collapse-container");
    if (collapseItem) collapseArray.push(collapseItem);

    isFirst = false;
  }

  // Set up the collapse group behavior
  await defineCollapseItems(collapseArray);

  return picArrayElement;
};

export const buildPicListItem = async (inputObj, isFirst) => {
  const { title, date } = inputObj;

  const picListItem = document.createElement("li");
  picListItem.className = "pic-list-item wrapper";

  //builds a pic container for pic array
  const picContainerElement = await buildPicContainer(inputObj);

  //build title element
  const dateElement = await buildPicContainerDate(date);
  const titleElement = await buildPicContainerTitle(title);
  titleElement.innerHTML = `${titleElement.textContent} <span>[${dateElement.textContent}]</span>`;

  // Wrap in a collapsible
  const picCollapseObj = {
    titleElement: titleElement,
    contentElement: picContainerElement,
    isExpanded: isFirst,
    className: "pic-element-collapse",
  };

  const picCollapseContainer = await buildCollapseContainer(picCollapseObj);
  picListItem.append(picCollapseContainer);

  return picListItem;
};

export const buildPicContainer = async (inputObj) => {
  const { date, picArray } = inputObj;

  const picContainerElement = document.createElement("article");
  picContainerElement.id = "pic-container-element";

  const picWrapper = await buildPicWrapper(picArray, true);

  //append pic set date
  const dateElement = await buildPicContainerDate(date);

  picContainerElement.append(picWrapper, dateElement);

  return picContainerElement;
};

export const buildPicContainerTitle = async (title) => {
  const titleElement = document.createElement("h2");
  titleElement.id = "pic-container-title";
  titleElement.textContent = title;

  return titleElement;
};

export const buildPicContainerDate = async (date) => {
  const dateElement = document.createElement("div");
  dateElement.id = "pic-container-date";
  const dateObj = new Date(date);
  dateElement.textContent = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateElement;
};

//--------------------------

export const buildPicWrapper = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picWrapperElement = document.createElement("li");
  picWrapperElement.id = "pic-wrapper-element";

  //build pic / stat elements
  for (let i = 0; i < inputArray.length; i++) {
    const picWrapperItem = await buildPicWrapperItem(inputArray[i]);
    if (!picWrapperItem) continue;

    picWrapperElement.append(picWrapperItem);
  }

  return picWrapperElement;
};

export const buildPicWrapperItem = async (inputObj) => {
  if (!inputObj || !inputObj.savePath) return null;
  const { savePath } = inputObj;

  // console.log("PIC WRAPPER ITEM");
  // console.log(inputObj);

  const picWrapperItem = document.createElement("li");
  picWrapperItem.id = "pic-wrapper-item";

  const picElement = await buildPicElement(savePath);
  const picStatsElement = await buildPicElementStats(inputObj);

  picWrapperItem.append(picElement, picStatsElement);

  return picWrapperItem;
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
export const buildPicElementStats = async (inputObj) => {
  if (!inputObj) return null;
  const { date, headers } = inputObj;

  const picStatsElement = document.createElement("div");
  picStatsElement.id = "pic-element-stats";

  const picDateElement = await buildPicElementDate(date);
  const picServerElement = await buildPicElementServer(headers);
  picStatsElement.append(picDateElement, picServerElement);

  return picStatsElement;
};

//extract / format pic date
export const buildPicElementDate = async (date) => {
  if (!date) return null;

  const dateElement = document.createElement("div");
  dateElement.id = "pic-element-date";
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  dateElement.innerHTML = `<b>Date:</b> ${formattedDate}`;

  return dateElement;
};

export const buildPicElementServer = async (headers) => {
  if (!headers || !headers.server) return null;
  const serverData = headers.server;

  const picServerElement = document.createElement("div");
  picServerElement.id = "pic-element-server";
  picServerElement.innerHTML = `<b>Server Data:</b> ${serverData}`;

  return picServerElement;
};
