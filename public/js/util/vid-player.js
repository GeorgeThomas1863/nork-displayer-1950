import { findChunkForTime, formatTime } from "./vid-builder.js";

// ===========================
// PLAYER INITIALIZATION

export const initializePlayer = async (inputObj) => {
  const { videoElement, progressContainer, progressBar, timeDisplay, processedChunks, totalDuration } = inputObj;

  // Create player state for this instance
  const playerState = {
    currentChunkIndex: -1,
    globalCurrentTime: 0,
    isUserSeeking: false,
    animationFrameId: null,
  };

  // Add playerState to the input object so other functions can access it
  inputObj.playerState = playerState;

  // Set up all event listeners
  await setupVideoEvents(inputObj);
  await setupProgressEvents(inputObj);

  // Start the main update loop
  updateProgress(inputObj);

  // Load the first chunk to start
  if (processedChunks.length > 0) {
    await loadChunk(inputObj, 0, 0);
  }

  // Return public API for controlling the player
  return {
    videoElement,
    play: () => videoElement.play(),
    pause: () => videoElement.pause(),
    seekTo: (time) => seekToTime(time, inputObj),
    getCurrentTime: () => playerState.globalCurrentTime,
    getTotalDuration: () => totalDuration,
    destroy: () => {
      // Clean up animation frame and clear container
      if (playerState.animationFrameId) {
        cancelAnimationFrame(playerState.animationFrameId);
      }
      const container = videoElement.closest(".video-player-container");
      if (container) {
        container.innerHTML = "";
      }
    },
  };
};

// ===========================
// CHUNK LOADING

// Load a specific video chunk into the video element
export const loadChunk = async (videoObj, chunkIndex, seekTime = 0) => {
  const { videoElement, processedChunks, playerState } = videoObj;

  if (chunkIndex < 0 || chunkIndex >= processedChunks.length) return;

  const chunk = processedChunks[chunkIndex];

  // Only change source if we're switching to a different chunk
  if (playerState.currentChunkIndex !== chunkIndex) {
    playerState.currentChunkIndex = chunkIndex;
    const chunkUrl = chunk.url;

    console.log(`Loading chunk ${chunkIndex + 1}: ${chunkUrl}`);
    videoElement.src = chunkUrl;

    // Seek to the correct time once the video loads
    const handleLoadedData = () => {
      videoElement.currentTime = seekTime;
      videoElement.removeEventListener("loadeddata", handleLoadedData);
    };

    videoElement.addEventListener("loadeddata", handleLoadedData);
  } else {
    // Same chunk, just seek to different time
    videoElement.currentTime = seekTime;
  }
};

// ===========================
// PROGRESS UPDATE FUNCTIONS

// Main update loop that runs on every animation frame
export const updateProgress = (inputObj) => {
  const { videoElement, progressBar, timeDisplay, processedChunks, totalDuration, playerState } = inputObj;

  // Skip updates if user is currently seeking
  if (playerState.isUserSeeking) {
    playerState.animationFrameId = requestAnimationFrame(() => updateProgress(inputObj));
    return;
  }

  const chunkInfo = findChunkForTime(processedChunks, playerState.globalCurrentTime);

  if (chunkInfo) {
    const { chunk, localTime } = chunkInfo;

    // Switch to correct chunk if needed
    if (playerState.currentChunkIndex !== chunk.chunkIndex) {
      loadChunk(inputObj, chunk.chunkIndex, localTime);
    }

    // Update progress bar visual
    updateProgressBar(inputObj);

    // Update time display text
    updateTimeDisplay(inputObj);
  }

  // Continue the update loop
  playerState.animationFrameId = requestAnimationFrame(() => updateProgress(inputObj));
};

// Update the visual progress bar
export const updateProgressBar = (inputObj) => {
  const { progressBar, playerState, totalDuration } = inputObj;
  const progressPercent = (playerState.globalCurrentTime / totalDuration) * 100;
  progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
};

// Update the time display text
export const updateTimeDisplay = (inputObj) => {
  const { timeDisplay, playerState, totalDuration } = inputObj;
  timeDisplay.textContent = `${formatTime(playerState.globalCurrentTime)} / ${formatTime(totalDuration)}`;
};

// ===========================
// EVENT HANDLING FUNCTIONS

// Set up video element event listeners
export const setupVideoEvents = async (videoObj) => {
  const { videoElement, processedChunks, playerState } = videoObj;

  // Handle video time updates during playback
  videoElement.addEventListener("timeupdate", () => {
    // Only update global time if we're not seeking and have a loaded chunk
    if (playerState.currentChunkIndex >= 0 && !playerState.isUserSeeking) {
      const chunk = processedChunks[playerState.currentChunkIndex];
      const videoCurrentTime = videoElement.currentTime;
      playerState.globalCurrentTime = chunk.globalStartTime + videoCurrentTime;

      // Auto-advance to next chunk when current chunk ends
      if (playerState.globalCurrentTime >= chunk.globalEndTime && playerState.currentChunkIndex < processedChunks.length - 1) {
        loadChunk(videoObj, playerState.currentChunkIndex + 1, 0);
      }
    }
  });

  // Handle when video ends
  videoElement.addEventListener("ended", () => {
    // If there's a next chunk, load it
    if (playerState.currentChunkIndex < processedChunks.length - 1) {
      loadChunk(videoObj, playerState.currentChunkIndex + 1, 0);
      videoElement.play(); // Continue playing the next chunk
    }
  });
};

// Set up progress bar click events for seeking
export const setupProgressEvents = async (videoObj) => {
  const { progressContainer, totalDuration } = videoObj;

  progressContainer.addEventListener("click", (e) => {
    // Calculate click position as percentage of total duration
    const rect = progressContainer.getBoundingClientRect();
    const clickPercent = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPercent * totalDuration;

    console.log(`Seeking to ${formatTime(seekTime)}`);
    seekToTime(seekTime, videoObj);
  });
};

// ===========================
// SEEKING FUNCTIONS

// Seek to a specific time in the overall video timeline
export const seekToTime = async (time, videoObj) => {
  const { processedChunks, playerState, videoElement } = videoObj;

  // Clamp time to valid range
  const totalDuration = processedChunks.length > 0 ? processedChunks[processedChunks.length - 1].globalEndTime : 0;
  const clampedTime = Math.max(0, Math.min(time, totalDuration));

  playerState.globalCurrentTime = clampedTime;
  const chunkInfo = findChunkForTime(processedChunks, playerState.globalCurrentTime);

  if (chunkInfo) {
    // Set seeking flag to prevent updates during seek
    playerState.isUserSeeking = true;

    // Load the correct chunk and seek to local time
    await loadChunk(videoObj, chunkInfo.chunk.chunkIndex, chunkInfo.localTime);

    // Clear seeking flag once seek is complete
    const handleSeeked = () => {
      playerState.isUserSeeking = false;
      videoElement.removeEventListener("seeked", handleSeeked);
    };

    videoElement.addEventListener("seeked", handleSeeked);
  }
};
