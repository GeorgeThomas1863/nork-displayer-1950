import { buildCollapseContainer, defineCollapseItems } from "../util/collapse.js";

//VID PAGE DISPLAY
export const buildWatchDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const watchArrayElement = document.createElement("ul");
  watchArrayElement.id = "watch-array-element";

  let isFirst = true;
  const collapseArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    const watchListItem = await buildWatchListItem(inputArray[i], isFirst);
    watchArrayElement.appendChild(watchListItem);

    // Store the collapse components for group functionality
    const collapseItem = watchListItem.querySelector(".collapse-container");
    if (collapseItem) collapseArray.push(collapseItem);

    isFirst = false;
  }

  // Set up the collapse group behavior
  await defineCollapseItems(collapseArray);

  return watchArrayElement;
};

export const buildWatchListItem = async (inputObj, isFirst) => {
  const { title, date } = inputObj;

  const watchListItem = document.createElement("li");
  watchListItem.className = "watch-list-item wrapper";

  const watchContainerElement = await buildWatchContainer(inputObj);

  //build title element
  const dateElement = await buildWatchDate(date);
  const titleElement = await buildWatchTitle(title);
  titleElement.innerHTML = `${titleElement.textContent} <span>[${dateElement.textContent}]</span>`;

  // Wrap the article content in a collapsible
  const watchCollapseObj = {
    titleElement: titleElement,
    contentElement: watchContainerElement,
    isExpanded: isFirst,
    className: "watch-element-collapse",
  };

  const watchCollapseContainer = await buildCollapseContainer(watchCollapseObj);
  watchListItem.append(watchCollapseContainer);

  return watchListItem;
};

//changed the path to vids by nesting in vidData
export const buildWatchContainer = async (inputObj) => {
  const { vidData, date } = inputObj;
  const { savePath } = vidData;

  const watchContainerElement = document.createElement("article");
  watchContainerElement.id = "watch-container-element";

  const watchElement = await buildWatchElement(savePath);
  const dateElement = await buildWatchDate(date);

  watchContainerElement.append(watchElement, dateElement);

  return watchContainerElement;
};

export const buildWatchTitle = async (title) => {
  const titleElement = document.createElement("h2");
  titleElement.id = "watch-title";
  titleElement.textContent = title;

  return titleElement;
};

export const buildWatchDate = async (date) => {
  const dateElement = document.createElement("div");
  dateElement.id = "watch-date";
  const dateObj = new Date(date);
  dateElement.textContent = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateElement;
};

export const buildWatchElement = async (savePath) => {
  if (!savePath) return null;

  const watchElement = document.createElement("video");
  watchElement.id = "watch-element";
  watchElement.controls = true;

  const sourceElement = document.createElement("source");
  const fileName = savePath.split("/").pop();
  const watchPath = "/kctv/" + fileName;

  sourceElement.src = watchPath;
  sourceElement.type = "video/mp4";

  watchElement.appendChild(sourceElement);

  return watchElement;
};
