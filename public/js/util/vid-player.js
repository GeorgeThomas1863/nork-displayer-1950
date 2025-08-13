import { state } from "./state";

// Global player state - each player instance will have its own state object

export const initializePlayer = async (inputObj) => {
  const { videoElement, progressContainer, progressBar, timeDisplay, processedChunks, totalDuration } = inputObj;

  // Create player state for this instance

  // Set up all event listeners
  await setupVideoEvents(inputObj);
  await setupProgressEvents(inputObj);

  // Start the main update loop
  await updateProgress(inputObj);

  // Load the first chunk to start
  if (processedChunks.length > 0) {
    await loadChunk(inputObj, 0);
  }

  // Return public API for controlling the player
  return {
    videoElement,
    play: () => videoElement.play(),
    pause: () => videoElement.pause(),
    seekTo: (time) => seekToTime(time, processedChunks, state, videoElement),
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

// Load a specific video chunk into the video element
export const loadChunk = async (videoObj, seekTime = 0) => {
  if (chunkIndex < 0 || chunkIndex >= processedChunks.length) return;
  const { videoElement, processedChunks, playerState } = videoObj;

  const chunk = processedChunks[chunkIndex];

  // Only change source if we're switching to a different chunk
  if (playerState.currentChunkIndex !== chunkIndex) {
    playerState.currentChunkIndex = chunkIndex;
    const chunkUrl = chunk.url || chunk.path || chunk.filename;

    console.log(`Loading chunk ${chunkIndex + 1}: ${chunkUrl}`);
    videoElement.src = chunkUrl;

    // Seek to the correct time once the video loads
    videoElement.addEventListener(
      "loadeddata",
      () => {
        videoElement.currentTime = seekTime;
      },
      { once: true }
    );
  } else {
    // Same chunk, just seek to different time
    videoElement.currentTime = seekTime;
  }
};

// ===========================
// PROGRESS UPDATE FUNCTIONS

// Main update loop that runs on every animation frame
export const updateProgress = async (inputObj) => {
  const { progressBar, timeDisplay, processedChunks, totalDuration, playerState, videoElement } = inputObj;
  // Skip updates if user is currently seeking
  if (playerState.isUserSeeking) return;

  const chunkInfo = findChunkForTime(processedChunks, playerState.globalCurrentTime);

  if (chunkInfo) {
    const { chunk, localTime } = chunkInfo;

    // Switch to correct chunk if needed
    if (playerState.currentChunkIndex !== chunk.chunkIndex) {
      await loadChunk(inputObj, localTime);
    }

    // Update progress bar visual
    await updateProgressBar(inputObj);

    // Update time display text
    await updateTimeDisplay(inputObj);
  }

  // Continue the update loop
  playerState.animationFrameId = requestAnimationFrame(() => {
    updateProgress(progressBar, timeDisplay, processedChunks, totalDuration, playerState, videoElement);
  });
};

// Update the visual progress bar
export const updateProgressBar = async (inputObj) => {
  const { progressBar, currentTime, totalDuration } = videoObj;
  const progressPercent = (currentTime / totalDuration) * 100;
  progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
};

// Update the time display text
export const updateTimeDisplay = async (inputObj) => {
  const { timeDisplay, currentTime, totalDuration } = inputObj;
  timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(totalDuration)}`;
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
        loadChunk(videoElement, processedChunks, playerState, playerState.currentChunkIndex + 1, 0);
      }
    }
  });
};

// Set up progress bar click events for seeking
export const setupProgressEvents = async (videoObj) => {
  const { progressContainer, totalDuration, processedChunks, playerState, videoElement } = videoObj;

  progressContainer.addEventListener("click", (e) => {
    // Calculate click position as percentage of total duration
    const rect = progressContainer.getBoundingClientRect();
    const clickPercent = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPercent * totalDuration;

    console.log(`Seeking to ${formatTime(seekTime)}`);
    seekToTime(seekTime, processedChunks, playerState, videoElement);
  });
};

// ===========================
// SEEKING FUNCTIONSs

// Seek to a specific time in the overall video timeline
export const seekToTime = async (time, processedChunks, playerState, videoElement) => {
  // Clamp time to valid range
  const totalDuration = processedChunks.length > 0 ? processedChunks[processedChunks.length - 1].globalEndTime : 0;

  playerState.globalCurrentTime = Math.max(0, Math.min(time, totalDuration));
  const chunkInfo = findChunkForTime(processedChunks, playerState.globalCurrentTime);

  if (chunkInfo) {
    // Set seeking flag to prevent updates during seek
    playerState.isUserSeeking = true;

    // Load the correct chunk and seek to local time
    loadChunk(videoElement, processedChunks, playerState, chunkInfo.chunk.chunkIndex, chunkInfo.localTime);

    // Clear seeking flag once seek is complete
    videoElement.addEventListener(
      "seeked",
      () => {
        playerState.isUserSeeking = false;
      },
      { once: true }
    );
  }
};
