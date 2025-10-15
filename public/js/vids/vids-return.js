import { buildCollapseContainer, defineCollapseItems } from "../util/collapse-display.js";

// VID PAGE DISPLAY
export const buildVidsReturnDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const vidArrayElement = document.createElement("ul");
  vidArrayElement.id = "vid-array-element";

  let isFirst = true;
  const collapseArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    try {
      const vidListItem = await buildVidListItem(inputArray[i], isFirst);
      if (!vidListItem) continue;
      vidArrayElement.appendChild(vidListItem);

      // Store the collapse components for group functionality
      const collapseItem = vidListItem.querySelector(".collapse-container");
      if (collapseItem) collapseArray.push(collapseItem);

      isFirst = false;

      // Set up the collapse group behavior
      await defineCollapseItems(collapseArray);

      return vidArrayElement;
    } catch (e) {
      console.log("VID BUILD FUCKED, ERROR MESSAGE: ", e.message);
      console.log("FUNCTION: ", e.function);
      console.dir("ERROR INPUT OBJ: ", e.inputObj);
    }
  }
};

export const buildVidListItem = async (inputObj, isFirst) => {
  if (!inputObj || !inputObj.manifestPath) {
    console.warn("Video item missing manifestPath:", inputObj);
    return null;
  }

  console.log("VID LIST ITEM INPUT OBJ");
  console.dir(inputObj);

  const { title, date, manifestPath } = inputObj;

  const vidListItem = document.createElement("li");
  vidListItem.className = "vid-list-item wrapper";

  // Create the HLS video player element - only pass the manifest path
  //   const vidPlayerElement = await buildHLSPlayer(manifestPath);

  //   if (!vidPlayerElement) {
  //     console.error("Failed to create video player for:", title);
  //     return null;
  //   }

  // Build title element with date
  const titleElement = await buildVidTitle(title);
  const dateElement = await buildVidDate(date);

  // Combine title and date
  if (dateElement) {
    titleElement.innerHTML = `${titleElement.innerHTML} <span class="vid-date-span">[${dateElement.textContent}]</span>`;
  }

  // Wrap the video player in a collapsible container
  const vidCollapseObj = {
    titleElement: titleElement,
    contentElement: vidPlayerElement,
    isExpanded: isFirst,
    className: "vid-element-collapse",
  };

  const vidCollapseContainer = await buildCollapseContainer(vidCollapseObj);
  vidListItem.append(vidCollapseContainer);

  return vidListItem;
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
