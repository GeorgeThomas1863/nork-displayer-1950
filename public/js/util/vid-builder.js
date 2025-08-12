// DYNAMIC VIDEO CHUNK PLAYER
// ===========================
// STEP 1: MAIN FUNCTION - Start here with your chunks array and container ID

export const displayChunkedVideo = async (inputArray, containerElementId) => {
  // Validate inputs
  if (!inputArray || !inputArray.length) {
    const error = new Error("No video chunks provided");
    error.function = "displayChunkedVideo";
    throw error;
  }

  const container = document.getElementById(containerElementId);
  if (!container) {
    throw new Error(`Container element with id '${containerElementId}' not found`);
  }

  console.log(`Creating dynamic player for ${inputArray.length} chunks`);

  // Process chunks and create player
  const processedData = await calculateChunkTiming(inputArray);
  return await createVideoPlayer(processedData, container);
};

// ===========================
// STEP 2: CHUNK PROCESSING - Calculate timing information

const calculateChunkTiming = async (inputArray) => {
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
    chunks: processedChunks,
    totalDuration: cumulativeTime,
  };

  return returnObj;
};

const sortChunksByOrder = async (inputArray) => {
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

export const createVideoPlayer = async (processedData, container) => {
  const { chunks: processedChunks, totalDuration } = processedData;

  // Clear container
  container.innerHTML = "";
  container.className = "video-player-container";

  // Create video element
  const videoElement = document.createElement("video");
  videoElement.controls = true;
  videoElement.className = "video-player-video";
  videoElement.id = `${container.id}-video`;

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
  container.appendChild(videoElement);
  container.appendChild(progressContainer);
  container.appendChild(timeDisplay);

  // Initialize player logic
  return initializePlayerLogic(videoElement, progressContainer, progressBar, timeDisplay, processedChunks, totalDuration);
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


