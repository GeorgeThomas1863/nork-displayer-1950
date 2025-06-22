import { buildCollapseContainer, defineCollapseItems } from "../collapse.js";
import { picDropDownContainer } from "./pic-container.js";

//PIC SET DISPLAY
export const buildPicDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picSetList = document.createElement("ul");
  picSetList.id = "pic-array-element";

  let isFirst = true;
  const collapseArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    const picSetListItem = await buildPicListItem(inputArray[i], isFirst);
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

export const buildPicListItem = async (inputObj, isFirst) => {
  const { title, date } = inputObj;

  const picSetListItem = document.createElement("li");
  picSetListItem.className = "pic-list-item";

  //builds a pic container for pic array
  const picSetElement = await buildPicElement(inputObj);

  //build title element
  const dateElement = await buildPicDate(date);
  const titleElement = await buildPicTitle(title);
  titleElement.innerHTML = `${titleElement.textContent} <span>[${dateElement.textContent}]</span>`;

  // Wrap the article content in a collapsible
  const picSetCollapseObj = {
    titleElement: titleElement,
    contentElement: picSetElement,
    isExpanded: isFirst,
    className: "pic-element-collapse",
  };

  const picSetCollapseContainer = await buildCollapseContainer(picSetCollapseObj);
  picSetListItem.append(picSetCollapseContainer);

  return picSetListItem;
};

export const buildPicTitle = async (title) => {
  const titleElement = document.createElement("h2");
  titleElement.id = "pic-title";
  titleElement.textContent = title;

  return titleElement;
};

export const buildPicElement = async (inputObj) => {
  const { date, picArray } = inputObj;

  const picSetElement = document.createElement("article");
  picSetElement.id = "pic-element";

  //Add pics as collapse
  const picSetPicData = await picDropDownContainer(picArray, "picSet");
  if (picSetPicData) {
    picSetElement.append(picSetPicData);
  }

  //append pic set date
  const dateElement = await buildPicDate(date);
  picSetElement.append(dateElement);

  return picSetElement;
};

export const buildPicDate = async (date) => {
  const dateElement = document.createElement("div");
  dateElement.id = "pic-date";
  const dateObj = new Date(date);
  dateElement.textContent = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateElement;
};
