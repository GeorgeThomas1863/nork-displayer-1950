import { buildCollapseContainer, defineCollapseItems } from "../util/collapse-display.js";

//ONLY NEED 1 VID DISPLAY FOR NOW
export const buildVidsReturnDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const vidDisplayContainer = document.createElement("div");
  vidDisplayContainer.id = "vid-display-container";

  //ADD VID TYPE SWITCH HERE LATER (only KCNA Watch for now)

  const watchDisplay = await buildWatchDisplay(inputArray);
  if (!watchDisplay) return null;
  vidDisplayContainer.append(watchDisplay);

  return vidDisplayContainer;
};

// FIX
export const buildWatchDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const vidArrayElement = document.createElement("ul");
  vidArrayElement.id = "vid-array-element";

  let isFirst = true;
  const collapseArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    const vidListItem = await buildVidListItem(inputArray[i], isFirst);
    if (!vidListItem) continue;
    vidArrayElement.appendChild(vidListItem);

    const collapseItem = vidListItem.querySelector(".collapse-container");
    if (collapseItem) collapseArray.push(collapseItem);
    isFirst = false;
  }

  if (!vidArrayElement.children.length) return null;
  await defineCollapseItems(collapseArray);
  return vidArrayElement;
};

export const buildVidListItem = async (inputObj, isFirst) => {
  if (!isValidVidRecord(inputObj)) return null;
  const { title, date } = inputObj;

  const vidListItem = document.createElement("li");
  vidListItem.className = "vid-list-item wrapper";

  const vidContainerElement = await buildVidContainer(inputObj);

  //build title element
  const dateElement = await buildVidDate(date);
  const titleElement = await buildVidTitle(title);
  const titleDateElement = document.createElement("span");
  titleDateElement.textContent = `[${dateElement.textContent}]`;
  titleElement.append(document.createTextNode(" "), titleDateElement);

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
  if (!isValidVidRecord(inputObj)) return null;
  const { mediaUrl, date } = inputObj;

  const vidContainerElement = document.createElement("article");
  vidContainerElement.className = "vid-container-element";

  const vidElement = await buildVidElement(mediaUrl);
  const dateElement = await buildVidDate(date);

  vidContainerElement.append(vidElement, dateElement);

  return vidContainerElement;
};

const isValidVidRecord = (inputObj) => {
  if (!inputObj || typeof inputObj !== "object") return false;
  const { title, date, mediaUrl } = inputObj;
  if (typeof title !== "string" || !title.trim()) return false;
  if (typeof date !== "string" || !date.trim()) return false;
  return typeof mediaUrl === "string" && Boolean(mediaUrl.trim());
};

export const buildVidTitle = (title) => {
  if (!title) return null;
  const titleElement = document.createElement("h2");
  titleElement.className = "vid-title";
  titleElement.textContent = title;

  return titleElement;
};

export const buildVidDate = (date) => {
  if (!date) return null;
  const dateElement = document.createElement("div");
  dateElement.className = "vid-date";
  const dateObj = new Date(date);
  dateElement.textContent = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return dateElement;
};

export const buildVidElement = (mediaUrl) => {
  if (!mediaUrl) return null;

  const vidElement = document.createElement("video");
  vidElement.className = "vid-element";
  vidElement.controls = true;

  const sourceElement = document.createElement("source");
  sourceElement.src = mediaUrl;
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

//     case "watch":
//       return buildWatchDisplay(inputArray);

//     default:
//       return null;
//   }
// };

// export const buildVidsAllDisplay = async (inputArray) => {
//   //BUILD
// };
