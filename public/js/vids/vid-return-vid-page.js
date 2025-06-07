import { buildVidElement } from "./vid-return-alone.js";
import { buildCollapseContainer, defineCollapseItems } from "../collapse.js";

//VID PAGE DISPLAY
export const buildVidPageDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const vidPageList = document.createElement("ul");
  vidPageList.id = "vid-page-array-element";

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

export const buildVidPageListItem = async (inputObj, isFirst) => {
  const { title, date } = inputObj;

  const vidPageListItem = document.createElement("li");
  vidPageListItem.className = "vid-page-list-item";

  //builds a pic container for pic array
  const vidPageElement = await buildVidPageElement(inputObj);

  //build title element
  const dateElement = await buildVidPageDate(date);
  const titleElement = await buildVidPageTitle(title);
  titleElement.innerHTML = `${titleElement.textContent};  <i>${dateElement.textContent}</i>`;

  // Wrap the article content in a collapsible
  const vidPageCollapseObj = {
    titleElement: titleElement,
    contentElement: vidPageElement,
    isExpanded: isFirst,
    className: "vid-page-element-collapse",
  };

  const vidPageCollapseContainer = await buildCollapseContainer(vidPageCollapseObj);
  vidPageListItem.append(vidPageCollapseContainer);

  return vidPageListItem;
};

export const buildVidPageTitle = async (title) => {
  const titleElement = document.createElement("h2");
  titleElement.id = "vid-page-title";
  titleElement.textContent = title;

  return titleElement;
};

//NEED TO ENSURE SAVE PATH IS IN INPUT OBJ
export const buildVidPageElement = async (inputObj) => {
  const { savePath } = inputObj;

  const vidPageElement = document.createElement("article");
  vidPageElement.id = "vid-page-element";

  const vidElement = await buildVidElement(savePath);
  vidPageElement.append(vidElement);

  return vidPageElement;
};

export const buildVidPageDate = async (date) => {
  const dateElement = document.createElement("div");
  dateElement.id = "vid-page-date";
  const dateObj = new Date(date);
  dateElement.textContent = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateElement;
};
