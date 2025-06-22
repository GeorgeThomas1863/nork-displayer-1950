import { buildCollapseContainer, defineCollapseItems } from "../collapse.js";

//VID PAGE DISPLAY
export const buildVidDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const vidPageList = document.createElement("ul");
  vidPageList.id = "vid-array-element";

  let isFirst = true;
  const collapseArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    const vidPageListItem = await buildVidListItem(inputArray[i], isFirst);
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

export const buildVidListItem = async (inputObj, isFirst) => {
  const { title, date } = inputObj;

  const vidPageListItem = document.createElement("li");
  vidPageListItem.className = "vid-list-item";

  //builds a pic container for pic array
  const vidPageElement = await buildVidElement(inputObj);

  //build title element
  const dateElement = await buildVidDate(date);
  const titleElement = await buildVidTitle(title);
  titleElement.innerHTML = `${titleElement.textContent} <span>[${dateElement.textContent}]</span>`;

  // Wrap the article content in a collapsible
  const vidPageCollapseObj = {
    titleElement: titleElement,
    contentElement: vidPageElement,
    isExpanded: isFirst,
    className: "vid-element-collapse",
  };

  const vidPageCollapseContainer = await buildCollapseContainer(vidPageCollapseObj);
  vidPageListItem.append(vidPageCollapseContainer);

  return vidPageListItem;
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

//NEED TO ENSURE SAVE PATH IS IN INPUT OBJ
// export const buildVidElement = async (inputObj) => {
//   const { savePath, date } = inputObj;

//   // console.log("VID PAGE ELEMENT");
//   // console.log(inputObj);

//   const vidPageElement = document.createElement("article");
//   vidPageElement.id = "vid-element";

//   const vidElement = await buildVidElement(savePath);
//   const dateElement = await buildVidPageDate(date);

//   vidPageElement.append(vidElement, dateElement);

//   return vidPageElement;
// };

export const buildVidElement = async (inputObj) => {
  const { savePath } = inputObj;
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
