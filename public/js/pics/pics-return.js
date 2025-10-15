import { buildCollapseContainer, defineCollapseItems } from "../util/collapse-display.js";

//PIC SET DISPLAY
export const buildPicsReturnDisplay = async (inputArray) => {
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
  const { date, headerData } = inputObj;

  const picStatsElement = document.createElement("div");
  picStatsElement.id = "pic-element-stats";

  const picDateElement = await buildPicElementDate(date);
  const picServerElement = await buildPicElementServer(headerData);
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

//EXTRACT PIC SERVER DATA
export const buildPicElementServer = async (headerData) => {
  if (!headerData || !headerData.server) return null;
  const serverData = headerData.server;

  const picServerElement = document.createElement("div");
  picServerElement.id = "pic-element-server";
  picServerElement.innerHTML = `<b>Server Data:</b> ${serverData}`;

  return picServerElement;
};

//-------------------------------------

export const picDropDownContainer = async (inputArray, type) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = await buildPicWrapper(inputArray, false);
  // console.log("PIC ARRAY ELEMENT");
  // console.log(picArrayElement);
  if (!picArrayElement) return null;

  //build pic title element
  const picTitleElement = document.createElement("div");
  picTitleElement.id = `${type}-pic-header`;
  picTitleElement.textContent = `${inputArray.length} ${type.toUpperCase()} PIC${inputArray.length > 1 ? "S" : ""}`;

  //EXTRACT PIC DATE?

  //build collapse container
  const picCollapseObj = {
    titleElement: picTitleElement,
    contentElement: picArrayElement,
    isExpanded: true,
    className: `${type}-pic-collapse`,
  };

  const picCollapseElement = await buildCollapseContainer(picCollapseObj);

  // console.log("PIC COLLAPSE ELEMENT");
  // console.log(picCollapseElement);

  return picCollapseElement;
};
