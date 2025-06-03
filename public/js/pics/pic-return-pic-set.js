import { buildCollapseContainer, defineCollapseItems } from "../collapse.js";
import { picDropDownContainer } from "./pic-return-alone.js";

//PIC SET DISPLAY
export const buildPicSetDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picSetList = document.createElement("ul");
  picSetList.id = "pic-set-array-element";

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

export const buildPicSetListItem = async (inputObj, isFirst) => {
  const { title } = inputObj;

  const picSetListItem = document.createElement("li");
  picSetListItem.className = "pic-set-list-item";

  //builds a pic container for pic array
  const picSetElement = await buildPicSetElement(inputObj);

  //build title element
  const titleElement = await buildPicSetTitle(title);

  // Wrap the article content in a collapsible
  const picSetCollapseObj = {
    titleElement: titleElement,
    contentElement: picSetElement,
    isExpanded: isFirst,
    className: "pic-set-element-collapse",
  };

  const picSetCollapseContainer = await buildCollapseContainer(picSetCollapseObj);
  picSetListItem.append(picSetCollapseContainer);

  return picSetListItem;
};

export const buildPicSetTitle = async (title) => {
  const titleElement = document.createElement("h2");
  titleElement.id = "pic-set-title";
  titleElement.textContent = title;

  return titleElement;
};

export const buildPicSetElement = async (inputObj) => {
  const { date, picArray } = inputObj;

  const picSetElement = document.createElement("article");
  picSetElement.id = "pic-set-element";

  //Add pics as collapse
  const picSetPicData = await picDropDownContainer(picArray, "PicSet");
  if (picSetPicData) {
    picSetElement.append(picSetPicData);
  }

  // Then append date and text after pictures (title is handled by collapse header)
  const dateElement = await buildPicSetDate(date);

  picSetElement.append(dateElement);

  return picSetElement;
};

export const buildPicSetDate = async (date) => {
  const dateElement = document.createElement("div");
  dateElement.id = "pic-set-date";
  const dateObj = new Date(date);
  dateElement.textContent = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateElement;
};


