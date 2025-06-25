import { buildCollapseContainer, defineCollapseItems } from "../collapse.js";

//PIC SET DISPLAY
export const buildPicDisplay = async (inputArray) => {
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

  const picSetListItem = document.createElement("li");
  picSetListItem.className = "pic-list-item";

  //builds a pic container for pic array
  const picContainerElement = await buildPicContainer(inputObj);

  //build title element
  const dateElement = await buildPicContainerDate(date);
  const titleElement = await buildPicContainerTitle(title);
  titleElement.innerHTML = `${titleElement.textContent} <span>[${dateElement.textContent}]</span>`;

  // Wrap the article content in a collapsible
  const picSetCollapseObj = {
    titleElement: titleElement,
    contentElement: picContainerElement,
    isExpanded: isFirst,
    className: "pic-element-collapse",
  };

  const picSetCollapseContainer = await buildCollapseContainer(picSetCollapseObj);
  picSetListItem.append(picSetCollapseContainer);

  return picSetListItem;
};

export const buildPicContainer = async (inputObj) => {
  const { date, picArray } = inputObj;

  const picContainerElement = document.createElement("article");
  picContainerElement.id = "pic-container-element";

  //Add pics as collapse
  const picContainerData = await picDropDownContainer(picArray, "");
  if (picContainerData) {
    picContainerElement.append(picContainerData);
  }

  //append pic set date
  const dateElement = await buildPicContainerDate(date);
  picContainerElement.append(dateElement);

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

export const buildPicWrapper = async (inputArray, fullStats = true) => {
  if (!inputArray || !inputArray.length) return null;

  const picWrapperElement = document.createElement("li");
  picWrapperElement.id = "pic-wrapper-element";

  //build pic / stat elements
  for (let i = 0; i < inputArray.length; i++) {
    const picWrapperItem = await buildPicWrapperItem(inputArray[i], fullStats);
    if (!picWrapperItem) continue;

    picWrapperElement.append(picWrapperItem);
  }

  return picWrapperElement;
};

export const buildPicWrapperItem = async (inputObj, fullStats = true) => {
  if (!inputObj || !inputObj.savePath) return null;
  const { savePath } = inputObj;

  const picWrapperItem = document.createElement("li");
  picWrapperItem.id = "pic-wrapper-item";

  const picElement = await buildPicElement(savePath);
  const picStatsElement = await buildPicElementStats(inputObj, fullStats);

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
export const buildPicElementStats = async (inputObj, fullStats = true) => {
  if (!inputObj) return null;
  const { picDate, picSource, headerData } = inputObj;

  const picStatsElement = document.createElement("div");
  picStatsElement.id = "pic-element-stats";

  //only include source on full stats
  if (fullStats) {
    const picDateElement = await buildPicElementDate(picDate);
    const picSourceElement = await buildPicElementSource(picSource);
    picStatsElement.append(picDateElement, picSourceElement);
  }

  const picServerElement = await buildPicElementServer(headerData);
  picStatsElement.append(picServerElement);

  return picStatsElement;
};

//extract / format pic date
export const buildPicElementDate = async (picDate) => {
  if (!picDate) return null;

  const dateElement = document.createElement("div");
  dateElement.id = "pic-element-date";
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
export const buildPicElementSource = async (picSource) => {
  if (!picSource) return null;

  const picSourceElement = document.createElement("div");
  picSourceElement.id = "pic-element-source";
  picSourceElement.innerHTML = `<b>Pic From:</b> ${picSource}`;

  return picSourceElement;
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
    className: "pic-element-collapse",
  };

  const picCollapseElement = await buildCollapseContainer(picCollapseObj);

  // console.log("PIC COLLAPSE ELEMENT");
  // console.log(picCollapseElement);

  return picCollapseElement;
};
