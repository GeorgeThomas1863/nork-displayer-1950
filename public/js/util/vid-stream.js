//CLAUDE's custom vid streamer

// Global state for video players
const videoPlayers = new Map();

// Create and initialize a video player
export const createVideoPlayer = async (videoId, container) => {
  try {
    // Get video metadata
    const response = await fetch(`/api/video/${videoId}/info`);
    const videoInfo = await response.json();

    // Create player state
    const playerState = {
      videoId,
      container,
      videoInfo,
      currentChunk: 0,
      videoElement: null,
      isLoading: false,
      preloadedChunks: new Map(),
      loadingElement: null,
      progressElement: null,
    };

    // Create DOM elements
    createVideoElements(playerState);

    // Load first chunk
    await loadVideoChunk(playerState, 0);

    // Set up event listeners
    setupVideoEventListeners(playerState);

    // Start preloading
    preloadNextChunks(playerState);

    // Store player state
    videoPlayers.set(videoId, playerState);

    return playerState;
  } catch (error) {
    console.error("Error initializing video player:", error);
    showVideoError(container, "Failed to load video");
  }
};

// Create video DOM elements
function createVideoElements(playerState) {
  const { container } = playerState;

  // Create video container
  const videoContainer = document.createElement("div");
  videoContainer.className = "video-container";
  videoContainer.style.cssText = `
    position: relative;
    width: 100%;
    max-width: 800px;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
  `;

  // Create video element
  const videoElement = document.createElement("video");
  videoElement.controls = true;
  videoElement.style.cssText = `
    width: 100%;
    height: auto;
    display: block;
  `;

  // Create loading indicator
  const loadingElement = document.createElement("div");
  loadingElement.className = "loading-indicator";
  loadingElement.textContent = "Loading...";
  loadingElement.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 18px;
    background: rgba(0,0,0,0.8);
    padding: 10px 20px;
    border-radius: 5px;
    display: none;
  `;

  // Create progress info
  const progressElement = document.createElement("div");
  progressElement.className = "chunk-progress";
  progressElement.style.cssText = `
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 3px;
    font-size: 12px;
  `;

  videoContainer.appendChild(videoElement);
  videoContainer.appendChild(loadingElement);
  videoContainer.appendChild(progressElement);

  container.appendChild(videoContainer);

  // Update player state
  playerState.videoElement = videoElement;
  playerState.loadingElement = loadingElement;
  playerState.progressElement = progressElement;
}

// Set up event listeners for video
function setupVideoEventListeners(playerState) {
  const { videoElement } = playerState;

  // Handle time updates to switch chunks
  videoElement.addEventListener("timeupdate", () => {
    handleVideoTimeUpdate(playerState);
  });

  // Handle seeking
  videoElement.addEventListener("seeking", () => {
    handleVideoSeeking(playerState);
  });

  // Handle chunk ending
  videoElement.addEventListener("ended", () => {
    handleVideoChunkEnded(playerState);
  });

  // Handle loading states
  videoElement.addEventListener("loadstart", () => {
    showVideoLoading(playerState, true);
  });

  videoElement.addEventListener("canplay", () => {
    showVideoLoading(playerState, false);
    preloadNextChunks(playerState); // Preload when ready
  });

  // Update progress display
  videoElement.addEventListener("timeupdate", () => {
    updateVideoProgressDisplay(playerState);
  });

  // Handle errors
  videoElement.addEventListener("error", (e) => {
    console.error("Video error:", e);
    showVideoError(playerState.container, "Error playing video");
  });
}

// Load a specific video chunk
async function loadVideoChunk(playerState, chunkIndex, seekTime = 0) {
  const { videoElement, currentChunk, isLoading, videoId, preloadedChunks, videoInfo } = playerState;

  if (isLoading || chunkIndex === currentChunk || chunkIndex >= videoInfo.totalChunks) {
    return;
  }

  playerState.isLoading = true;
  showVideoLoading(playerState, true);

  try {
    const wasPlaying = !videoElement.paused;
    const currentTime = getCurrentVideoTime(playerState);

    // Check if chunk is preloaded
    if (preloadedChunks.has(chunkIndex)) {
      videoElement.src = preloadedChunks.get(chunkIndex);
    } else {
      videoElement.src = `/api/video/${videoId}/chunk/${chunkIndex}`;
    }

    playerState.currentChunk = chunkIndex;

    // Wait for the video to load
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Timeout loading chunk"));
      }, 10000);

      const onCanPlay = () => {
        cleanup();
        resolve();
      };

      const onError = (e) => {
        cleanup();
        reject(new Error(`Failed to load chunk: ${e.message}`));
      };

      const cleanup = () => {
        clearTimeout(timeout);
        videoElement.removeEventListener("canplay", onCanPlay);
        videoElement.removeEventListener("error", onError);
      };

      videoElement.addEventListener("canplay", onCanPlay);
      videoElement.addEventListener("error", onError);
      videoElement.load();
    });

    // Set seek time if specified
    if (seekTime > 0) {
      videoElement.currentTime = seekTime;
    }

    // Resume playing if it was playing before
    if (wasPlaying) {
      try {
        await videoElement.play();
      } catch (playError) {
        console.warn("Autoplay prevented:", playError);
      }
    }
  } catch (error) {
    console.error("Error loading chunk:", error);
    showVideoError(playerState.container, `Failed to load video segment ${chunkIndex + 1}`);
  } finally {
    playerState.isLoading = false;
    showVideoLoading(playerState, false);
  }
}

// Handle time updates for chunk switching
function handleVideoTimeUpdate(playerState) {
  const { videoElement, currentChunk, videoInfo } = playerState;
  const currentTime = videoElement.currentTime;
  const chunkDuration = videoInfo.chunkDuration;

  // Switch to next chunk 1 second before current chunk ends
  if (currentTime >= chunkDuration - 1 && currentChunk < videoInfo.totalChunks - 1) {
    loadVideoChunk(playerState, currentChunk + 1);
  }
}

// Handle seeking across chunks
function handleVideoSeeking(playerState) {
  const totalVideoTime = getCurrentVideoTime(playerState);
  const chunkDuration = playerState.videoInfo.chunkDuration;

  // Calculate which chunk the seek time falls into
  const targetChunk = Math.floor(totalVideoTime / chunkDuration);
  const chunkSeekTime = totalVideoTime % chunkDuration;

  if (targetChunk !== playerState.currentChunk && targetChunk < playerState.videoInfo.totalChunks) {
    loadVideoChunk(playerState, targetChunk, chunkSeekTime);
  }
}

// Handle when a chunk ends
function handleVideoChunkEnded(playerState) {
  const { currentChunk, videoInfo } = playerState;

  if (currentChunk < videoInfo.totalChunks - 1) {
    loadVideoChunk(playerState, currentChunk + 1);
  }
}

// Get current time across all chunks
function getCurrentVideoTime(playerState) {
  const { currentChunk, videoElement, videoInfo } = playerState;
  return currentChunk * videoInfo.chunkDuration + videoElement.currentTime;
}

// Preload next chunks for smooth playback
async function preloadNextChunks(playerState) {
  const { currentChunk, videoInfo, videoId, preloadedChunks } = playerState;
  const chunksToPreload = 2;

  for (let i = 1; i <= chunksToPreload; i++) {
    const nextChunkIndex = currentChunk + i;

    if (nextChunkIndex < videoInfo.totalChunks && !preloadedChunks.has(nextChunkIndex)) {
      try {
        const response = await fetch(`/api/video/${videoId}/chunk/${nextChunkIndex}`);
        if (!response.ok) continue;

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        preloadedChunks.set(nextChunkIndex, url);

        // Clean up old preloaded chunks to save memory
        cleanupOldChunks(playerState);
      } catch (error) {
        console.warn(`Failed to preload chunk ${nextChunkIndex}:`, error);
      }
    }
  }
}

// Clean up old preloaded chunks
function cleanupOldChunks(playerState) {
  const { preloadedChunks, currentChunk } = playerState;

  if (preloadedChunks.size > 4) {
    for (const [chunkIndex, url] of preloadedChunks.entries()) {
      if (chunkIndex < currentChunk - 1) {
        URL.revokeObjectURL(url);
        preloadedChunks.delete(chunkIndex);
      }
    }
  }
}

// Show/hide loading indicator
function showVideoLoading(playerState, show) {
  if (playerState.loadingElement) {
    playerState.loadingElement.style.display = show ? "block" : "none";
  }
}

// Show error message
function showVideoError(container, message) {
  const errorElement = document.createElement("div");
  errorElement.style.cssText = `
    padding: 20px;
    background: #ffebee;
    color: #c62828;
    border: 1px solid #ef5350;
    border-radius: 4px;
    text-align: center;
    font-family: Arial, sans-serif;
  `;
  errorElement.textContent = message;

  container.innerHTML = "";
  container.appendChild(errorElement);
}

// Update progress display
function updateVideoProgressDisplay(playerState) {
  const { progressElement, videoInfo, currentChunk } = playerState;

  if (!progressElement) return;

  const totalTime = getCurrentVideoTime(playerState);
  const totalDuration = videoInfo.totalChunks * videoInfo.chunkDuration;

  progressElement.textContent = `Chunk ${currentChunk + 1}/${videoInfo.totalChunks} | ` + `${formatTime(totalTime)} / ${formatTime(totalDuration)}`;
}

// Format time as MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Clean up a video player
function destroyVideoPlayer(videoId) {
  const playerState = videoPlayers.get(videoId);
  if (!playerState) return;

  // Revoke all blob URLs to prevent memory leaks
  for (const url of playerState.preloadedChunks.values()) {
    URL.revokeObjectURL(url);
  }

  playerState.preloadedChunks.clear();
  videoPlayers.delete(videoId);
}

// Main function to display a single video
async function displayVideo(videoId, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container '${containerId}' not found`);
    return null;
  }

  // Clean up existing player if any
  if (videoPlayers.has(videoId)) {
    destroyVideoPlayer(videoId);
  }

  return await createVideoPlayer(videoId, container);
}

// Function to display all available videos
async function displayAllVideos(containerId = "videos-container") {
  try {
    const response = await fetch("/api/videos");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    let videosContainer = document.getElementById(containerId);
    if (!videosContainer) {
      videosContainer = document.createElement("div");
      videosContainer.id = containerId;
      document.body.appendChild(videosContainer);
    }

    // Clear existing content
    videosContainer.innerHTML = "";

    for (const videoId of data.videos) {
      // Create container for each video
      const videoContainer = document.createElement("div");
      videoContainer.id = `video-${videoId}`;
      videoContainer.style.cssText = `
        margin: 20px 0;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: #f9f9f9;
      `;

      const title = document.createElement("h3");
      title.textContent = `Video: ${videoId}`;
      title.style.cssText = `
        margin: 0 0 15px 0;
        color: #333;
        font-family: Arial, sans-serif;
      `;

      videoContainer.appendChild(title);
      videosContainer.appendChild(videoContainer);

      // Initialize video player
      await displayVideo(videoId, videoContainer.id);
    }
  } catch (error) {
    console.error("Error loading videos:", error);
    showVideoError(document.getElementById(containerId) || document.body, "Failed to load videos. Please check your connection.");
  }
}

// Utility function to get player state
function getVideoPlayer(videoId) {
  return videoPlayers.get(videoId);
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  displayAllVideos();
});

// Clean up when page unloads
window.addEventListener("beforeunload", () => {
  for (const videoId of videoPlayers.keys()) {
    destroyVideoPlayer(videoId);
  }
});
