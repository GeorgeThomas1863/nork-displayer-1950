// hls-player.js
// Simplified HLS player that just handles video playback

// Store HLS instances by video element ID
const hlsInstances = new Map();

// Create a simple video player element with HLS support
export const createHLSPlayer = async (manifestPath) => {
  if (!manifestPath) {
    console.error("No manifest path provided for video");
    return null;
  }

  // Generate unique ID for this player - simple timestamp is sufficient
  const playerId = `hls-player-${Date.now()}`;

  // Create container for the player
  const playerContainer = document.createElement("div");
  playerContainer.className = "hls-player-container";
  playerContainer.id = playerId;

  // Create video element
  const video = document.createElement("video");
  video.className = "hls-video-player";
  video.controls = true;
  video.id = `${playerId}-video`;

  // Create status div for messages
  const statusDiv = document.createElement("div");
  statusDiv.className = "hls-status";
  statusDiv.style.display = "none";

  // Assemble the player container
  playerContainer.appendChild(statusDiv);
  playerContainer.appendChild(video);

  // Initialize HLS after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeHLS({
      videoElement: video,
      manifestPath: manifestPath,
      statusDiv: statusDiv,
    });
  }, 100);

  return playerContainer;
};

// Initialize HLS for a specific video element
const initializeHLS = (config) => {
  const { videoElement, manifestPath, statusDiv } = config;

  // Construct the full URL for the manifest
  // Assuming your Express server serves the manifest files from the root
  // Adjust this if your server structure is different
  const manifestUrl = manifestPath.startsWith("http") ? manifestPath : `${window.location.origin}${manifestPath}`;

  console.log("Loading HLS manifest from:", manifestUrl);

  // Check if HLS.js is available
  if (typeof Hls === "undefined") {
    console.error("HLS.js library not loaded. Make sure to include it in your HTML.");
    showStatus({ statusDiv, message: "HLS.js library not found", type: "error" });
    return;
  }

  // Check for HLS support
  if (Hls.isSupported()) {
    // Clean up any existing HLS instance for this video
    const existingHls = hlsInstances.get(videoElement.id);
    if (existingHls) {
      existingHls.destroy();
      hlsInstances.delete(videoElement.id);
    }

    // Create new HLS instance
    const hls = new Hls({
      debug: false,
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
    });

    // Store the instance
    hlsInstances.set(videoElement.id, hls);

    // Load the manifest
    hls.loadSource(manifestUrl);
    hls.attachMedia(videoElement);

    // Set up HLS events
    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      console.log(`Manifest loaded for ${videoElement.id}. Found ${data.levels.length} quality level(s)`);

      // Auto-select best quality
      hls.currentLevel = -1; // -1 means auto

      showStatus({ statusDiv, message: "Video ready", type: "success", autoHide: true });
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error(`HLS Error for ${videoElement.id}:`, data);

      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            showStatus({ statusDiv, message: "Network error - retrying...", type: "error" });
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            showStatus({ statusDiv, message: "Media error - recovering...", type: "error" });
            hls.recoverMediaError();
            break;
          default:
            showStatus({ statusDiv, message: `Fatal error: ${data.details}`, type: "error" });
            hls.destroy();
            hlsInstances.delete(videoElement.id);
            break;
        }
      }
    });

    // Video element events
    videoElement.addEventListener("loadstart", () => {
      showStatus({ statusDiv, message: "Loading video...", type: "info" });
    });

    videoElement.addEventListener("waiting", () => {
      showStatus({ statusDiv, message: "Buffering...", type: "info" });
    });

    videoElement.addEventListener("playing", () => {
      statusDiv.style.display = "none";
    });

    videoElement.addEventListener("error", (e) => {
      console.error(`Video error for ${videoElement.id}:`, e);
      showStatus({ statusDiv, message: "Playback error", type: "error" });
    });
  } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
    // Native HLS support (Safari)
    console.log(`Using native HLS support for ${videoElement.id}`);
    videoElement.src = manifestUrl;
    showStatus({ statusDiv, message: "Using native HLS support", type: "info", autoHide: true });
  } else {
    showStatus({ statusDiv, message: "HLS not supported in this browser", type: "error" });
    console.error("HLS is not supported in this browser");
  }
};

// Show status messages
const showStatus = (config) => {
  const { statusDiv, message, type = "info", autoHide = false } = config;

  if (!statusDiv) return;

  statusDiv.textContent = message;
  statusDiv.className = `hls-status hls-status-${type}`;
  statusDiv.style.display = "block";

  if (autoHide && type !== "error") {
    setTimeout(() => {
      statusDiv.style.display = "none";
    }, 3000);
  }
};

// Clean up all HLS instances (call this when leaving the page or cleaning up)
export const cleanupAllHLSInstances = () => {
  for (const [id, hls] of hlsInstances) {
    hls.destroy();
  }
  hlsInstances.clear();
};

// Clean up a specific HLS instance
export const cleanupHLSInstance = (videoElementId) => {
  const hls = hlsInstances.get(videoElementId);
  if (hls) {
    hls.destroy();
    hlsInstances.delete(videoElementId);
  }
};
