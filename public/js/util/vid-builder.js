import { initializePlayer } from "./vid-player.js";

// ===========================
// STEP 1: MAIN FUNCTION - Start here with your chunks array

export const buildChunkedVideo = async (inputArray) => {
  // Validate inputs
  if (!inputArray || !inputArray.length) {
    const error = new Error("No video chunks provided");
    error.function = "buildChunkedVideo";
    throw error;
  }

  // console.log("!!!BUILD CHUNKED VIDEO");
  // console.dir(inputArray);

  const vidContainer = document.createElement("div");
  vidContainer.id = "vid-container";

  console.log(`Creating dynamic player for ${inputArray.length} chunks`);

  // Process chunks and create player
  const processedData = await calculateChunkTiming(inputArray);
  // console.log("PROCESSED DATA CALCULATE CHUNK TIMING");
  // console.log(processedData);

  const { playerInstance, videoPlayerElement } = await createVideoPlayer(processedData);
  if (!playerInstance) return null;

  vidContainer.appendChild(videoPlayerElement);
  // console.log("!!!VID CONTAINER");
  // console.dir(vidContainer);

  // return playerInstance;
  return vidContainer;
};

// ===========================
// STEP 2: CHUNK PROCESSING - Calculate timing information

export const calculateChunkTiming = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const sortArray = await sortChunksByOrder(inputArray);
  if (!sortArray || !sortArray.length) return null;

  const processedChunks = [];
  let cumulativeTime = 0;

  for (let i = 0; i < sortArray.length; i++) {
    const chunk = sortArray[i];

    processedChunks.push({
      chunkName: chunk.chunkName,
      chunkPath: chunk.chunkPath,
      url: `/video/${encodeURIComponent(chunk.chunkName)}`, // Server endpoint for video
      globalStartTime: cumulativeTime,
      globalEndTime: cumulativeTime + chunk.duration,
      duration: chunk.duration,
      chunkSizeBytes: chunk.chunkSizeBytes,
      chunkIndex: i,
    });

    cumulativeTime += chunk.duration;
  }

  return {
    processedChunks: processedChunks,
    totalDuration: cumulativeTime,
  };
};

export const sortChunksByOrder = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  // Sort by chunk name (chunk_000, chunk_001, etc.)
  const sortedChunks = [...inputArray].sort((a, b) => {
    // Extract number from chunk name (e.g., "chunk_000.mp4" -> 0)
    const getChunkNumber = (chunkName) => {
      const match = chunkName.match(/chunk_(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    return getChunkNumber(a.chunkName) - getChunkNumber(b.chunkName);
  });

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
  const playerInstance = await initializePlayer(videoObj);

  // Return both the DOM element and the player instance
  return {
    playerInstance,
    videoPlayerElement,
  };
};

// ===========================
// STEP 4: UTILITY FUNCTIONS - Helper functions for calculations

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
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
