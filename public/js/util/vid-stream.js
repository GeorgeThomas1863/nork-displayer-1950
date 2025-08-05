//CLAUDE's VID STREAMER, NEED TO INTEGRATE

// Global state for video players
const videoPlayers = new Map();

// Create and initialize a video player from data object
const createVideoPlayer = async (videoData, container) => {
  try {
    // Extract video info from data object
    const videoInfo = {
      videoId: videoData.vidData.vidName,
      totalChunks: videoData.vidData.totalChunks,
      chunkDuration: 30, // You can adjust this or get from data if available
      title: videoData.title,
      date: videoData.date,
      thumbnail: videoData.thumbnail,
      vidSizeMB: videoData.vidData.vidSizeMB,
      vidId: videoData.vidData.vidId,
    };

    // Create player state
    const playerState = {
      videoData,
      videoInfo,
      currentChunk: 0,
      videoElement: null,
      isLoading: false,
      preloadedChunks: new Map(),
      loadingElement: null,
      progressElement: null,
      container,
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
    videoPlayers.set(videoInfo.videoId, playerState);

    return playerState;
  } catch (error) {
    console.error("Error initializing video player:", error);
    showVideoError(container, "Failed to load video");
  }
};

// Create video DOM elements with metadata
const createVideoElements = ({ container, videoInfo, videoData }) => {
  // Create main video item container
  const videoItem = document.createElement("div");
  videoItem.className = "video-item";

  // Create thumbnail if available
  if (videoData.thumbnail) {
    const thumbnail = document.createElement("img");
    thumbnail.src = videoData.thumbnail;
    thumbnail.alt = videoInfo.title;
    thumbnail.className = "video-thumbnail";
    thumbnail.onerror = () => (thumbnail.style.display = "none");
    videoItem.appendChild(thumbnail);
  }

  // Create info wrapper
  const infoWrapper = document.createElement("div");
  infoWrapper.className = "video-info-wrapper";

  // Create title
  const title = document.createElement("h3");
  title.className = "video-title";
  title.textContent = videoInfo.title;
  infoWrapper.appendChild(title);

  // Create metadata
  const metaContainer = document.createElement("div");
  metaContainer.className = "video-meta";

  // Metadata items configuration
  const metaItems = [
    { label: "Date", value: formatDate(videoData.date) },
    { label: "Size", value: `${videoInfo.vidSizeMB} MB` },
    { label: "Duration", value: `~${Math.ceil((videoInfo.totalChunks * videoInfo.chunkDuration) / 60)} min` },
    { label: "Chunks", value: videoInfo.totalChunks },
  ];

  // Create metadata items
  metaItems.forEach(({ label, value }) => {
    const item = document.createElement("div");
    item.className = "video-meta-item";
    item.innerHTML = `
      <span class="video-meta-label">${label}:</span>
      <span>${value}</span>
    `;
    metaContainer.appendChild(item);
  });

  infoWrapper.appendChild(metaContainer);
  videoItem.appendChild(infoWrapper);

  // Create video container
  const videoContainer = document.createElement("div");
  videoContainer.className = "video-container";

  // Create video element
  const videoElement = document.createElement("video");
  Object.assign(videoElement, {
    controls: true,
    className: "video-element",
    preload: "metadata",
  });

  // Create loading indicator
  const loadingElement = document.createElement("div");
  Object.assign(loadingElement, {
    className: "loading-indicator",
    textContent: "Loading...",
  });

  // Create progress info
  const progressElement = document.createElement("div");
  progressElement.className = "chunk-progress";

  // Append all elements
  [videoElement, loadingElement, progressElement].forEach((el) => videoContainer.appendChild(el));

  videoItem.appendChild(videoContainer);
  container.appendChild(videoItem);

  // Update player state
  Object.assign(arguments[0], {
    videoElement,
    loadingElement,
    progressElement,
  });
};

// Set up event listeners for video
const setupVideoEventListeners = (playerState) => {
  const { videoElement } = playerState;

  // Event listener configurations
  const eventListeners = [
    { event: "timeupdate", handler: () => handleVideoTimeUpdate(playerState) },
    { event: "seeking", handler: () => handleVideoSeeking(playerState) },
    { event: "ended", handler: () => handleVideoChunkEnded(playerState) },
    { event: "loadstart", handler: () => showVideoLoading(playerState, true) },
    {
      event: "canplay",
      handler: () => {
        showVideoLoading(playerState, false);
        preloadNextChunks(playerState);
      },
    },
    { event: "timeupdate", handler: () => updateVideoProgressDisplay(playerState) },
    {
      event: "error",
      handler: (e) => {
        console.error("Video error:", e);
        showVideoError(playerState.container, "Error playing video");
      },
    },
  ];

  // Add all event listeners
  eventListeners.forEach(({ event, handler }) => videoElement.addEventListener(event, handler));
};

// Load a specific video chunk using data object
const loadVideoChunk = async (playerState, chunkIndex, seekTime = 0) => {
  const { videoElement, currentChunk, isLoading, videoInfo, preloadedChunks } = playerState;

  if (isLoading || chunkIndex === currentChunk || chunkIndex >= videoInfo.totalChunks) {
    return;
  }

  playerState.isLoading = true;
  showVideoLoading(playerState, true);

  try {
    const wasPlaying = !videoElement.paused;

    // Set video source - check preloaded chunks first
    videoElement.src = preloadedChunks.has(chunkIndex) ? preloadedChunks.get(chunkIndex) : `/api/video/${videoInfo.videoId}/chunk/${chunkIndex}`;

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
};

// Handle time updates for chunk switching
const handleVideoTimeUpdate = ({ videoElement, currentChunk, videoInfo }) => {
  const { currentTime } = videoElement;
  const { chunkDuration, totalChunks } = videoInfo;

  // Switch to next chunk 1 second before current chunk ends
  if (currentTime >= chunkDuration - 1 && currentChunk < totalChunks - 1) {
    loadVideoChunk(arguments[0], currentChunk + 1);
  }
};

// Handle seeking across chunks
const handleVideoSeeking = (playerState) => {
  const totalVideoTime = getCurrentVideoTime(playerState);
  const { chunkDuration, totalChunks } = playerState.videoInfo;

  // Calculate which chunk the seek time falls into
  const targetChunk = Math.floor(totalVideoTime / chunkDuration);
  const chunkSeekTime = totalVideoTime % chunkDuration;

  if (targetChunk !== playerState.currentChunk && targetChunk < totalChunks) {
    loadVideoChunk(playerState, targetChunk, chunkSeekTime);
  }
};

// Handle when a chunk ends
const handleVideoChunkEnded = ({ currentChunk, videoInfo }) => {
  if (currentChunk < videoInfo.totalChunks - 1) {
    loadVideoChunk(arguments[0], currentChunk + 1);
  }
};

// Get current time across all chunks
const getCurrentVideoTime = ({ currentChunk, videoElement, videoInfo }) => currentChunk * videoInfo.chunkDuration + videoElement.currentTime;

// Preload next chunks for smooth playback
const preloadNextChunks = async ({ currentChunk, videoInfo, preloadedChunks }) => {
  const chunksToPreload = 2;
  const { totalChunks, videoId } = videoInfo;

  const preloadPromises = Array.from({ length: chunksToPreload }, (_, i) => {
    const nextChunkIndex = currentChunk + i + 1;

    if (nextChunkIndex < totalChunks && !preloadedChunks.has(nextChunkIndex)) {
      return fetch(`/api/video/${videoId}/chunk/${nextChunkIndex}`)
        .then((response) => (response.ok ? response.blob() : null))
        .then((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            preloadedChunks.set(nextChunkIndex, url);
          }
        })
        .catch((error) => console.warn(`Failed to preload chunk ${nextChunkIndex}:`, error));
    }
    return Promise.resolve();
  });

  await Promise.allSettled(preloadPromises);

  // Clean up old preloaded chunks
  cleanupOldChunks(arguments[0]);
};

// Clean up old preloaded chunks
const cleanupOldChunks = ({ preloadedChunks, currentChunk }) => {
  if (preloadedChunks.size > 4) {
    [...preloadedChunks.entries()]
      .filter(([chunkIndex]) => chunkIndex < currentChunk - 1)
      .forEach(([chunkIndex, url]) => {
        URL.revokeObjectURL(url);
        preloadedChunks.delete(chunkIndex);
      });
  }
};

// Show/hide loading indicator
const showVideoLoading = ({ loadingElement }, show) => {
  if (loadingElement) {
    loadingElement.classList.toggle("show", show);
  }
};

// Show error message
const showVideoError = (container, message) => {
  const errorElement = document.createElement("div");
  Object.assign(errorElement, {
    className: "video-error",
    textContent: message,
  });

  container.innerHTML = "";
  container.appendChild(errorElement);
};

// Update progress display
const updateVideoProgressDisplay = (playerState) => {
  const { progressElement, videoInfo, currentChunk } = playerState;

  if (!progressElement) return;

  const totalTime = getCurrentVideoTime(playerState);
  const totalDuration = videoInfo.totalChunks * videoInfo.chunkDuration;

  progressElement.textContent = `Chunk ${currentChunk + 1}/${videoInfo.totalChunks} | ` + `${formatTime(totalTime)} / ${formatTime(totalDuration)}`;
};

// Format time as MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Clean up a video player
const destroyVideoPlayer = (videoId) => {
  const playerState = videoPlayers.get(videoId);
  if (!playerState) return;

  // Revoke all blob URLs to prevent memory leaks
  [...playerState.preloadedChunks.values()].forEach(URL.revokeObjectURL);

  playerState.preloadedChunks.clear();
  videoPlayers.delete(videoId);
};

// Main function to display a single video from data object - EXPORTED
export const displayVideoFromData = async (videoData, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container '${containerId}' not found`);
    return null;
  }

  const videoId = videoData.vidData.vidName;

  // Clean up existing player if any
  if (videoPlayers.has(videoId)) {
    destroyVideoPlayer(videoId);
  }

  return await createVideoPlayer(videoData, container);
};

// Function to display multiple videos from data array - EXPORTED
export const displayVideosFromData = async (videosData, containerId = "videos-container") => {
  try {
    let videosContainer = document.getElementById(containerId);
    if (!videosContainer) {
      videosContainer = document.createElement("div");
      Object.assign(videosContainer, {
        id: containerId,
        className: "videos-container",
      });
      document.body.appendChild(videosContainer);
    }

    // Clear existing content
    videosContainer.innerHTML = "";

    // Process each video data object with better error handling
    const playerPromises = videosData.map(async (videoData, index) => {
      try {
        const videoId = videoData.vidData.vidName;

        // Create container for each video
        const videoContainer = document.createElement("div");
        videoContainer.id = `video-${videoId}`;
        videosContainer.appendChild(videoContainer);

        // Initialize video player with data
        return await createVideoPlayer(videoData, videoContainer);
      } catch (error) {
        console.error(`Error loading video ${index}:`, error);
        return null;
      }
    });

    const results = await Promise.allSettled(playerPromises);
    const successCount = results.filter((result) => result.status === "fulfilled" && result.value).length;

    console.log(`Successfully loaded ${successCount}/${videosData.length} videos`);
  } catch (error) {
    console.error("Error loading videos from data:", error);
    showVideoError(document.getElementById(containerId) || document.body, "Failed to load videos from data.");
  }
};

// Legacy function for backward compatibility - fetches from API - EXPORTED
export const displayAllVideos = async (containerId = "videos-container") => {
  try {
    const response = await fetch("/api/videos-data");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const videosData = await response.json();
    await displayVideosFromData(videosData, containerId);
  } catch (error) {
    console.error("Error loading videos:", error);
    showVideoError(document.getElementById(containerId) || document.body, "Failed to load videos. Please check your connection.");
  }
};

// Utility function to get player state - EXPORTED
export const getVideoPlayer = (videoId) => videoPlayers.get(videoId);

// Utility function to get all active players - EXPORTED
export const getAllVideoPlayers = () => new Map(videoPlayers);

// Utility function to destroy all players - EXPORTED
export const destroyAllVideoPlayers = () => {
  [...videoPlayers.keys()].forEach(destroyVideoPlayer);
};

// Clean up when page unloads
window.addEventListener("beforeunload", destroyAllVideoPlayers);

// Auto-initialize when page loads (optional - can be removed if you want manual control)
document.addEventListener("DOMContentLoaded", () => {
  // Only auto-load if there's a videos container already in the DOM
  if (document.getElementById("videos-container")) {
    displayAllVideos();
  }
});
