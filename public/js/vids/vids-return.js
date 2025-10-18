import { buildCollapseContainer, defineCollapseItems } from "../util/collapse-display.js";
import stateFront from "../util/state-front.js";

//ONLY NEED 1 VID DISPLAY FOR NOW
export const buildVidsReturnDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const vidDisplayContainer = document.createElement("div");
  vidDisplayContainer.id = "vid-display-container";

  const vidTypeButtons = await buildVidTypeButtons();
  vidDisplayContainer.append(vidTypeButtons);

  //ADD SWITCH HERE LATER

  const vidPagesDisplay = await buildVidPagesDisplay(inputArray);
  vidDisplayContainer.append(vidPagesDisplay);

  return vidDisplayContainer;
};

export const buildVidTypeButtons = async () => {
  const vidTypeButtonContainer = document.createElement("div");
  vidTypeButtonContainer.id = "vid-type-button-container";
  vidTypeButtonContainer.className = "button-type-container";

  // Only vid pages to start
  const buttonData = [{ buttonValue: "vidPages", buttonText: "KCNA Vid Pages" }];

  // Create button list
  const buttonList = document.createElement("ul");
  buttonList.id = "vid-type-button-list";
  buttonList.className = "button-type-list";

  // Build each button
  for (let i = 0; i < buttonData.length; i++) {
    const buttonItem = await buildVidTypeButtonItem(buttonData[i]);
    buttonList.append(buttonItem);
  }

  vidTypeButtonContainer.append(buttonList);
  return vidTypeButtonContainer;
};

export const buildVidTypeButtonItem = async (buttonData) => {
  const { vidType } = stateFront;
  const { buttonValue, buttonText } = buttonData;

  const buttonListItem = document.createElement("li");
  buttonListItem.className = "button-type-list-item";

  const button = document.createElement("button");
  button.id = `vid-type-button-${buttonValue}`;
  button.className = "button-type-item";
  button.setAttribute("data-update", `vid-type-button-${buttonValue}`);
  button.innerHTML = buttonText;

  //add active type
  if (vidType === buttonValue) button.classList.add("active");

  buttonListItem.append(button);
  return buttonListItem;
};

// FIX
export const buildVidPagesDisplay = async (inputArray) => {
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
  if (!title) return null;
  const titleElement = document.createElement("h2");
  titleElement.id = "vid-title";
  titleElement.textContent = title;

  return titleElement;
};

export const buildVidDate = async (date) => {
  if (!date) return null;
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

// Main function to build the complete video display from backend data
// export const buildCompleteVideoDisplay = async (backendData) => {
//   if (!backendData || !Array.isArray(backendData)) {
//     console.error("Invalid backend data provided");
//     return null;
//   }

//   // Create main container for all videos
//   const mainContainer = document.createElement("div");
//   mainContainer.className = "video-display-container";

//   // Extract video items from the backend data structure
//   const videoItems = [];

//   for (let i = 0; i < backendData.length; i++) {
//     const dataGroup = backendData[i];

//     // Check if this group contains video data
//     if (dataGroup.dataType === "vids" || dataGroup.dataType === "watch") {
//       if (dataGroup.dataArray && Array.isArray(dataGroup.dataArray)) {
//         // Add all video items from this group
//         for (let j = 0; j < dataGroup.dataArray.length; j++) {
//           const videoItem = dataGroup.dataArray[j];
//           // Add a type indicator based on the dataType
//           videoItem.sourceType = dataGroup.dataType;
//           videoItems.push(videoItem);
//         }
//       }
//     }
//   }

//   if (videoItems.length === 0) {
//     console.warn("No video items found in backend data");
//     const noVideosMessage = document.createElement("p");
//     noVideosMessage.className = "no-videos-message";
//     noVideosMessage.textContent = "No videos available";
//     mainContainer.appendChild(noVideosMessage);
//     return mainContainer;
//   }

//   // Build the video display with all found video items
//   const videoDisplay = await buildVidDisplay(videoItems);

//   if (videoDisplay) {
//     mainContainer.appendChild(videoDisplay);
//   }

//   return mainContainer;
// };

// // Cleanup function to call when removing the video display
// export const cleanupVideoDisplay = () => {
//   cleanupAllHLSInstances();
// };

// export const buildVidsReturnDisplay = async (inputArray) => {
//   if (!inputArray || !inputArray.length) return null;
//   const { vidType } = stateFront;

//   switch (vidType) {
//     case "all":
//       return buildVidsAllDisplay(inputArray);

//     case "vidPages":
//       return buildVidPagesDisplay(inputArray);

//     default:
//       return null;
//   }
// };

// export const buildVidsAllDisplay = async (inputArray) => {
//   //BUILD
// };
