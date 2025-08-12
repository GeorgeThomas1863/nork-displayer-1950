// VIDEO PLAYER LOGIC (STEP 4)
// ===========================
// Player state management and event handling functions

// Global player state - each player instance will have its own state object
const createPlayerState = () => ({
  currentChunkIndex: -1,
  globalCurrentTime: 0,
  isUserSeeking: false,
  animationFrameId: null,
});

// ===========================
// CHUNK LOADING FUNCTIONS

// Load a specific video chunk into the video element
const loadChunk = (videoElement, processedChunks, playerState, chunkIndex, seekTime = 0) => {
  if (chunkIndex < 0 || chunkIndex >= processedChunks.length) return;

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
const updateProgress = (progressBar, timeDisplay, processedChunks, totalDuration, playerState, videoElement) => {
  // Skip updates if user is currently seeking
  if (playerState.isUserSeeking) return;

  const chunkInfo = findChunkForTime(processedChunks, playerState.globalCurrentTime);

  if (chunkInfo) {
    const { chunk, localTime } = chunkInfo;

    // Switch to correct chunk if needed
    if (playerState.currentChunkIndex !== chunk.chunkIndex) {
      loadChunk(videoElement, processedChunks, playerState, chunk.chunkIndex, localTime);
    }

    // Update progress bar visual
    updateProgressBar(progressBar, playerState.globalCurrentTime, totalDuration);

    // Update time display text
    updateTimeDisplay(timeDisplay, playerState.globalCurrentTime, totalDuration);
  }

  // Continue the update loop
  playerState.animationFrameId = requestAnimationFrame(() => {
    updateProgress(progressBar, timeDisplay, processedChunks, totalDuration, playerState, videoElement);
  });
};

// Update the visual progress bar
const updateProgressBar = (progressBar, currentTime, totalDuration) => {
  const progressPercent = (currentTime / totalDuration) * 100;
  progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
};

// Update the time display text
const updateTimeDisplay = (timeDisplay, currentTime, totalDuration) => {
  timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(totalDuration)}`;
};

// ===========================
// EVENT HANDLING FUNCTIONS

// Set up video element event listeners
const setupVideoEvents = (videoElement, processedChunks, playerState) => {
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
const setupProgressEvents = (progressContainer, totalDuration, processedChunks, playerState, videoElement) => {
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
// SEEKING FUNCTIONS

// Seek to a specific time in the overall video timeline
const seekToTime = (time, processedChunks, playerState, videoElement) => {
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

// ===========================
// MAIN INITIALIZATION FUNCTION

// Initialize all player logic and return API
const initializePlayerLogic = (videoElement, progressContainer, progressBar, timeDisplay, processedChunks, totalDuration) => {
  // Create player state for this instance
  const playerState = createPlayerState();

  // Set up all event listeners
  setupVideoEvents(videoElement, processedChunks, playerState);
  setupProgressEvents(progressContainer, totalDuration, processedChunks, playerState, videoElement);

  // Start the main update loop
  updateProgress(progressBar, timeDisplay, processedChunks, totalDuration, playerState, videoElement);

  // Load the first chunk to start
  if (processedChunks.length > 0) {
    loadChunk(videoElement, processedChunks, playerState, 0, 0);
  }

  // Return public API for controlling the player
  return {
    videoElement,
    play: () => videoElement.play(),
    pause: () => videoElement.pause(),
    seekTo: (time) => seekToTime(time, processedChunks, playerState, videoElement),
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
