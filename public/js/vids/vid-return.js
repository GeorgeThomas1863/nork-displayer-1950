import { buildCollapseContainer, defineCollapseItems } from "../util/collapse.js";

//VID PAGE DISPLAY
export const buildVidDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const vidArrayElement = document.createElement("ul");
  vidArrayElement.id = "vid-array-element";

  let isFirst = true;
  const collapseArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    const vidListItem = await buildVidListItem(inputArray[i], isFirst);
    vidArrayElement.appendChild(vidListItem);

    // Store the collapse components for group functionality
    const collapseItem = vidListItem.querySelector(".collapse-container");
    if (collapseItem) collapseArray.push(collapseItem);

    isFirst = false;
  }

  // Set up the collapse group behavior
  await defineCollapseItems(collapseArray);

  return vidArrayElement;
};

export const buildVidListItem = async (inputObj, isFirst) => {
  const { title, date } = inputObj;

  const vidListItem = document.createElement("li");
  vidListItem.className = "vid-list-item wrapper";

  const vidContainerElement = await buildVidContainer(inputObj);

  //build title element
  const dateElement = await buildVidDate(date);
  const titleElement = await buildVidTitle(title);
  titleElement.innerHTML = `${titleElement.textContent} <span>[${dateElement.textContent}]</span>`;

  // Wrap the article content in a collapsible
  const vidCollapseObj = {
    titleElement: titleElement,
    contentElement: vidContainerElement,
    isExpanded: isFirst,
    className: "vid-element-collapse",
  };

  const vidCollapseContainer = await buildCollapseContainer(vidCollapseObj);
  vidListItem.append(vidCollapseContainer);

  return vidListItem;
};

//changed the path to vids by nesting in vidData
export const buildVidContainer = async (inputObj) => {
  const { vidData, date } = inputObj;
  const { savePath } = vidData;

  const vidContainerElement = document.createElement("article");
  vidContainerElement.id = "vid-container-element";

  const vidElement = await buildVidElement(savePath);
  const dateElement = await buildVidDate(date);

  vidContainerElement.append(vidElement, dateElement);

  return vidContainerElement;
};

export const buildVidTitle = async (title) => {
  const titleElement = document.createElement("h2");
  titleElement.id = "vid-title";
  titleElement.textContent = title;

  return titleElement;
};

export const buildVidDate = async (date) => {
  const dateElement = document.createElement("div");
  dateElement.id = "vid-date";
  const dateObj = new Date(date);
  dateElement.textContent = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateElement;
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
