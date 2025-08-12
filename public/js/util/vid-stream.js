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
  const sortedChunks = [...chunksArray];

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

const createVideoPlayer = (processedData, container) => {
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
// STEP 4: PLAYER LOGIC - Handle playback and chunk switching

const initializePlayerLogic = (videoElement, progressContainer, progressBar, timeDisplay, processedChunks, totalDuration) => {
  // Player state
  let currentChunkIndex = -1;
  let globalCurrentTime = 0;
  let isUserSeeking = false;
  let animationFrameId = null;

  // Set up event listeners
  setupVideoEvents(videoElement, processedChunks);
  setupProgressEvents(progressContainer, totalDuration, processedChunks);

  // Start update loop
  startUpdateLoop();

  // Load first chunk
  if (processedChunks.length > 0) {
    loadChunk(0, 0);
  }

  // Return player API
  return createPlayerAPI();

  // ===========================
  // NESTED FUNCTIONS for player logic

  function loadChunk(chunkIndex, seekTime = 0) {
    if (chunkIndex < 0 || chunkIndex >= processedChunks.length) return;

    const chunk = processedChunks[chunkIndex];

    if (currentChunkIndex !== chunkIndex) {
      currentChunkIndex = chunkIndex;
      const chunkUrl = chunk.url || chunk.path || chunk.filename;

      videoElement.src = chunkUrl;

      videoElement.addEventListener(
        "loadeddata",
        () => {
          videoElement.currentTime = seekTime;
        },
        { once: true }
      );
    } else {
      videoElement.currentTime = seekTime;
    }
  }

  function updateProgress() {
    if (isUserSeeking) return;

    const chunkInfo = findChunkForTime(processedChunks, globalCurrentTime);

    if (chunkInfo) {
      const { chunk, localTime } = chunkInfo;

      // Switch chunk if needed
      if (currentChunkIndex !== chunk.chunkIndex) {
        loadChunk(chunk.chunkIndex, localTime);
      }

      // Update progress bar
      const progressPercent = (globalCurrentTime / totalDuration) * 100;
      progressBar.style.width = `${Math.min(progressPercent, 100)}%`;

      // Update time display
      timeDisplay.textContent = `${formatTime(globalCurrentTime)} / ${formatTime(totalDuration)}`;
    }

    animationFrameId = requestAnimationFrame(updateProgress);
  }

  function setupVideoEvents(videoElement, processedChunks) {
    videoElement.addEventListener("timeupdate", () => {
      if (currentChunkIndex >= 0 && !isUserSeeking) {
        const chunk = processedChunks[currentChunkIndex];
        const videoCurrentTime = videoElement.currentTime;
        globalCurrentTime = chunk.globalStartTime + videoCurrentTime;

        // Check if we need to move to next chunk
        if (globalCurrentTime >= chunk.globalEndTime && currentChunkIndex < processedChunks.length - 1) {
          loadChunk(currentChunkIndex + 1, 0);
        }
      }
    });
  }

  function setupProgressEvents(progressContainer, totalDuration, processedChunks) {
    progressContainer.addEventListener("click", (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickPercent = (e.clientX - rect.left) / rect.width;
      const seekTime = clickPercent * totalDuration;

      seekToTime(seekTime);
    });
  }

  function seekToTime(time) {
    globalCurrentTime = Math.max(0, Math.min(time, totalDuration));
    const chunkInfo = findChunkForTime(processedChunks, globalCurrentTime);

    if (chunkInfo) {
      isUserSeeking = true;
      loadChunk(chunkInfo.chunk.chunkIndex, chunkInfo.localTime);

      videoElement.addEventListener(
        "seeked",
        () => {
          isUserSeeking = false;
        },
        { once: true }
      );
    }
  }

  function startUpdateLoop() {
    updateProgress();
  }

  function createPlayerAPI() {
    return {
      videoElement,
      play: () => videoElement.play(),
      pause: () => videoElement.pause(),
      seekTo: seekToTime,
      getCurrentTime: () => globalCurrentTime,
      getTotalDuration: () => totalDuration,
      destroy: () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        container.innerHTML = "";
      },
    };
  }
};

// ===========================
// STEP 5: UTILITY FUNCTIONS - Helper functions for calculations

const findChunkForTime = (processedChunks, currentTime) => {
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

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// ===========================
// USAGE EXAMPLE:
/*
// 1. Include the CSS file in your HTML:
// <link rel="stylesheet" href="video-player.css">

// 2. Create a container in your HTML:
// <div id="videoContainer"></div>

// 3. Define your chunks array:
const videoChunks = [
  { url: '/videos/chunk1.mp4', duration: 30, order: 1 },
  { url: '/videos/chunk2.mp4', duration: 25, order: 2 },
  { url: '/videos/chunk3.mp4', duration: 40, order: 3 }
];

// 4. Create the player:
const player = displayChunkedVideo(videoChunks, 'videoContainer');

// 5. Use player controls:
player.play();
player.pause();
player.seekTo(45);

// 6. Clean up when done:
// player.destroy();
*/
