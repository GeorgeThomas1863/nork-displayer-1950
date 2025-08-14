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
    isDestroyed: false,
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

  // Return the full inputObj with API methods for controlling the player
  // This is CRITICAL - we return the full object so API functions can access all properties
  return {
    ...inputObj, // Spread all properties including playerState, processedChunks, etc.
    // Add convenience methods
    play: () => videoElement.play(),
    pause: () => videoElement.pause(),
    seekTo: (time) => seekToTime(time, inputObj),
    getCurrentTime: () => playerState.globalCurrentTime,
    getTotalDuration: () => totalDuration,
    destroy: () => {
      // Set destroyed flag to stop update loop
      playerState.isDestroyed = true;

      // Clean up animation frame
      if (playerState.animationFrameId) {
        cancelAnimationFrame(playerState.animationFrameId);
      }

      // Clear video source
      videoElement.src = "";
      videoElement.load();

      // Clear container
      const container = videoElement.closest(".video-player-element");
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

  if (chunkIndex < 0 || chunkIndex >= processedChunks.length) {
    console.error(`Invalid chunk index: ${chunkIndex}`);
    return;
  }

  const chunk = processedChunks[chunkIndex];

  try {
    // Only change source if we're switching to a different chunk
    if (playerState.currentChunkIndex !== chunkIndex) {
      playerState.currentChunkIndex = chunkIndex;
      const chunkUrl = chunk.url;

      console.log(`Loading chunk ${chunkIndex + 1}: ${chunkUrl}`);

      // Clear any existing load handlers
      videoElement.onloadeddata = null;
      videoElement.onloadedmetadata = null;

      // Set new source
      videoElement.src = chunkUrl;

      // Handle seeking after load
      const handleLoadedData = () => {
        videoElement.currentTime = seekTime;
        videoElement.onloadeddata = null;
        videoElement.onloadedmetadata = null;
      };

      // Check if video is already loaded
      if (videoElement.readyState >= 2) {
        // Video is already loaded, seek immediately
        videoElement.currentTime = seekTime;
      } else {
        // Wait for video to load, then seek
        videoElement.onloadeddata = handleLoadedData;
        // Fallback to loadedmetadata if loadeddata doesn't fire
        videoElement.onloadedmetadata = () => {
          if (videoElement.readyState >= 2) {
            handleLoadedData();
          }
        };
      }
    } else {
      // Same chunk, just seek to different time
      videoElement.currentTime = seekTime;
    }
  } catch (error) {
    console.error("Error loading chunk:", error);
    // Reset seeking flag on error to prevent stuck state
    playerState.isUserSeeking = false;
  }
};

// ===========================
// PROGRESS UPDATE FUNCTIONS

// Main update loop that runs on every animation frame
export const updateProgress = (inputObj) => {
  const { videoElement, progressBar, timeDisplay, processedChunks, totalDuration, playerState } = inputObj;

  // Stop if player is destroyed
  if (playerState.isDestroyed) {
    return;
  }

  // Skip updates if user is currently seeking
  if (!playerState.isUserSeeking) {
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
  }

  // Continue the update loop if not destroyed
  if (!playerState.isDestroyed) {
    playerState.animationFrameId = requestAnimationFrame(() => updateProgress(inputObj));
  }
};

// Update the visual progress bar
export const updateProgressBar = (inputObj) => {
  const { progressBar, playerState, totalDuration } = inputObj;

  if (totalDuration > 0) {
    const progressPercent = (playerState.globalCurrentTime / totalDuration) * 100;
    progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
  }
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

      if (chunk) {
        const videoCurrentTime = videoElement.currentTime;
        playerState.globalCurrentTime = chunk.globalStartTime + videoCurrentTime;

        // Auto-advance to next chunk when current chunk is near end
        // Using 0.1 second buffer to prevent missing the end
        if (videoCurrentTime >= chunk.duration - 0.1 && playerState.currentChunkIndex < processedChunks.length - 1) {
          console.log(`Auto-advancing from chunk ${playerState.currentChunkIndex + 1} to ${playerState.currentChunkIndex + 2}`);
          loadChunk(videoObj, playerState.currentChunkIndex + 1, 0);
        }
      }
    }
  });

  // Handle when video ends
  videoElement.addEventListener("ended", () => {
    // If there's a next chunk, load it
    if (playerState.currentChunkIndex < processedChunks.length - 1) {
      const nextIndex = playerState.currentChunkIndex + 1;
      console.log(`Video ended, loading next chunk ${nextIndex + 1}`);
      loadChunk(videoObj, nextIndex, 0);
      videoElement.play(); // Continue playing the next chunk
    } else {
      console.log("All chunks finished playing");
    }
  });

  // Handle video errors
  videoElement.addEventListener("error", (e) => {
    console.error("Video playback error:", e);
    // Reset seeking flag to prevent stuck state
    playerState.isUserSeeking = false;
  });

  // Handle loading start
  videoElement.addEventListener("loadstart", () => {
    console.log("Loading video chunk...");
  });

  // Handle when video can play
  videoElement.addEventListener("canplay", () => {
    console.log("Video can play");
  });
};

// Set up progress bar click events for seeking
export const setupProgressEvents = async (videoObj) => {
  const { progressContainer, totalDuration } = videoObj;

  progressContainer.addEventListener("click", (e) => {
    // Calculate click position as percentage of total duration
    const rect = progressContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    // Ensure percentage is between 0 and 1
    const clickPercent = Math.max(0, Math.min(1, x / width));
    const seekTime = clickPercent * totalDuration;

    console.log(`Progress bar clicked at ${formatTime(seekTime)}`);
    seekToTime(seekTime, videoObj);
  });

  // Add hover effect for progress bar
  progressContainer.addEventListener("mousemove", (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const hoverPercent = Math.max(0, Math.min(1, x / width));
    const hoverTime = hoverPercent * totalDuration;

    // You can add a tooltip here if desired
    progressContainer.title = formatTime(hoverTime);
  });
};

// ===========================
// SEEKING FUNCTIONS

// Seek to a specific time in the overall video timeline
export const seekToTime = async (time, videoObj) => {
  const { processedChunks, playerState, videoElement } = videoObj;

  // Validate chunks exist
  if (!processedChunks || processedChunks.length === 0) {
    console.error("No chunks available for seeking");
    return;
  }

  // Clamp time to valid range
  const totalDuration = processedChunks[processedChunks.length - 1].globalEndTime;
  const clampedTime = Math.max(0, Math.min(time, totalDuration));

  console.log(`Seeking to ${formatTime(clampedTime)}`);

  playerState.globalCurrentTime = clampedTime;
  const chunkInfo = findChunkForTime(processedChunks, playerState.globalCurrentTime);

  if (chunkInfo) {
    // Set seeking flag to prevent updates during seek
    playerState.isUserSeeking = true;

    // Load the correct chunk and seek to local time
    await loadChunk(videoObj, chunkInfo.chunk.chunkIndex, chunkInfo.localTime);

    // Clear seeking flag once seek is complete
    const handleSeeked = () => {
      console.log("Seek completed");
      playerState.isUserSeeking = false;
      videoElement.removeEventListener("seeked", handleSeeked);
    };

    // Add timeout fallback in case seeked event never fires
    const seekTimeout = setTimeout(() => {
      console.log("Seek timeout - forcing seek complete");
      playerState.isUserSeeking = false;
      videoElement.removeEventListener("seeked", handleSeeked);
    }, 1000);

    videoElement.addEventListener("seeked", () => {
      clearTimeout(seekTimeout);
      handleSeeked();
    });
  } else {
    console.error("Could not find chunk for time:", clampedTime);
    playerState.isUserSeeking = false;
  }
};
