import { initializePlayer } from "./vid-player.js";

// ===========================
// STEP 1: MAIN FUNCTION - Start here with your chunks array and container ID

export const buildChunkedVideo = async (inputArray) => {
  // Validate inputs
  if (!inputArray || !inputArray.length) {
    const error = new Error("No video chunks provided");
    error.function = "displayChunkedVideo";
    throw error;
  }

  console.log("!!!BUILD CHUNKED VIDEO");
  console.dir(inputArray);

  const vidContainer = document.createElement("div");
  vidContainer.id = "vid-container";

  console.log(`Creating dynamic player for ${inputArray.length} chunks`);

  // Process chunks and create player
  const processedData = await calculateChunkTiming(inputArray);
  console.log("PROCESSED DATA CALCULATE CHUNK TIMING");
  console.log(processedData);
  const videoPlayerElement = await createVideoPlayer(processedData);
  if (!videoPlayerElement) return null;

  vidContainer.appendChild(videoPlayerElement);

  return videoPlayerElement;
};

// ===========================
// STEP 2: CHUNK PROCESSING - Calculate timing information

export const calculateChunkTiming = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const sortArray = await sortChunksByOrder(inputArray);
  if (!sortArray || !sortArray.length) return null;

  let cumulativeTime = 0;
  const processedChunks = [];
  for (let i = 0; i < sortArray.length; i++) {
    const chunk = sortArray[i];
    const duration = chunk.duration || chunk.endTime - chunk.startTime || 0;

    processedChunks.push({
      ...chunk,
      globalStartTime: cumulativeTime,
      globalEndTime: cumulativeTime + duration,
      duration: duration,
      chunkIndex: i,
    });

    cumulativeTime += duration;
  }

  const returnObj = {
    processedChunks: processedChunks,
    totalDuration: cumulativeTime,
  };

  return returnObj;
};

export const sortChunksByOrder = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const sortedChunks = [...inputArray];

  // Bubble sort by order property
  for (let i = 0; i < sortedChunks.length - 1; i++) {
    for (let j = 0; j < sortedChunks.length - i - 1; j++) {
      const orderA = sortedChunks[j].order || sortedChunks[j].index || j;
      const orderB = sortedChunks[j + 1].order || sortedChunks[j + 1].index || j + 1;

      if (orderA > orderB) {
        const temp = sortedChunks[j];
        sortedChunks[j] = sortedChunks[j + 1];
        sortedChunks[j + 1] = temp;
      }
    }
  }

  return sortedChunks;
};

// ===========================
// STEP 3: DOM CREATION - Build the video player interface

export const createVideoPlayer = async (processedData) => {
  const { processedChunks, totalDuration } = processedData;

  const videoPlayerElement = document.createElement("div");
  videoPlayerElement.className = "video-player-element";

  // Clear container
  videoPlayerElement.innerHTML = "";

  // Create video element
  const videoElement = document.createElement("video");
  videoElement.controls = true;
  videoElement.className = "video-element";
  // videoElement.id = `${container.id}-video`;

  // Create progress container
  const progressContainer = document.createElement("div");
  progressContainer.className = "video-player-progress-container";

  // Create progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "video-player-progress-bar";

  // Create time display
  const timeDisplay = document.createElement("div");
  timeDisplay.className = "video-player-time-display";

  // Assemble DOM
  progressContainer.appendChild(progressBar);
  videoPlayerElement.append(videoElement, progressContainer, timeDisplay);

  const videoObj = {
    videoElement: videoElement,
    progressContainer: progressContainer,
    progressBar: progressBar,
    timeDisplay: timeDisplay,
    processedChunks: processedChunks,
    totalDuration: totalDuration,
  };

  // Initialize player logic
  return initializePlayer(videoObj);
};

// ===========================
// STEP 5: UTILITY FUNCTIONS - Helper functions for calculations

export const findChunkForTime = (processedChunks, currentTime) => {
  for (let i = 0; i < processedChunks.length; i++) {
    const chunk = processedChunks[i];
    if (currentTime >= chunk.globalStartTime && currentTime < chunk.globalEndTime) {
      return {
        chunk: chunk,
        localTime: currentTime - chunk.globalStartTime,
      };
    }
  }

  // If we're past the end, return the last chunk
  if (processedChunks.length > 0) {
    const lastChunk = processedChunks[processedChunks.length - 1];
    return {
      chunk: lastChunk,
      localTime: lastChunk.duration,
    };
  }

  return null;
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
