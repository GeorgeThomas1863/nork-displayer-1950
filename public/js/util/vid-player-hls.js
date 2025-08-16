// hls-player.js
// Simplified HLS player that creates just the video element and controls
// Works with your collapse structure

// Store HLS instances by video element ID
const hlsInstances = new Map();

// Create a simple video player element with HLS support
export const createHLSPlayer = async (videoData) => {
  if (!videoData || !videoData.manifestPath) {
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

  // Create video info section
  const infoDiv = document.createElement("div");
  infoDiv.className = "hls-video-info";

  // Add video information if available
  let infoHtml = "";
  if (videoData.title) {
    infoHtml += `<div class="info-item"><strong>Title:</strong> ${videoData.title}</div>`;
  }
  if (videoData.type) {
    infoHtml += `<div class="info-item"><strong>Type:</strong> ${videoData.type}</div>`;
  }
  if (videoData.vidData) {
    if (videoData.vidData.vidSizeMB) {
      infoHtml += `<div class="info-item"><strong>Size:</strong> ${videoData.vidData.vidSizeMB}MB</div>`;
    }
    if (videoData.vidData.totalChunks || videoData.vidData.downloadChunks) {
      const chunks = videoData.vidData.totalChunks || videoData.vidData.downloadChunks;
      infoHtml += `<div class="info-item"><strong>Chunks:</strong> ${chunks}</div>`;
    }
  }
  if (videoData.streamData && videoData.streamData.length > 0) {
    infoHtml += `<div class="info-item"><strong>Stream segments:</strong> ${videoData.streamData.length}</div>`;
  }

  if (infoHtml) {
    infoDiv.innerHTML = infoHtml;
  }

  // Create quality selector
  const qualityContainer = document.createElement("div");
  qualityContainer.className = "hls-quality-selector";
  qualityContainer.style.display = "none"; // Hide initially, show if multiple qualities available

  const qualityLabel = document.createElement("label");
  qualityLabel.textContent = "Quality: ";

  const qualitySelect = document.createElement("select");
  qualitySelect.className = "hls-quality-select";
  qualitySelect.id = `${playerId}-quality`;

  // Add auto option
  const autoOption = document.createElement("option");
  autoOption.value = "-1";
  autoOption.textContent = "Auto";
  qualitySelect.appendChild(autoOption);

  qualityContainer.appendChild(qualityLabel);
  qualityContainer.appendChild(qualitySelect);

  // Assemble the player container
  playerContainer.appendChild(statusDiv);
  playerContainer.appendChild(video);
  playerContainer.appendChild(qualityContainer);
  if (infoHtml) {
    playerContainer.appendChild(infoDiv);
  }

  // Initialize HLS after a short delay to ensure DOM is ready
  setTimeout(() => {
    const hlsConfig = {
      videoElement: video,
      manifestPath: videoData.manifestPath,
      statusDiv: statusDiv,
      qualitySelect: qualitySelect,
      qualityContainer: qualityContainer,
    };
    initializeHLS(hlsConfig);
  }, 100);

  return playerContainer;
};

// Initialize HLS for a specific video element
const initializeHLS = (config) => {
  const { videoElement, manifestPath, statusDiv, qualitySelect, qualityContainer } = config;

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

      // Show quality selector if multiple levels available
      if (data.levels.length > 1) {
        // Clear existing options except Auto (first option)
        const optionsToRemove = qualitySelect.options.length - 1;
        for (let i = 0; i < optionsToRemove; i++) {
          qualitySelect.remove(1); // Always remove index 1 since we're keeping index 0
        }

        // Add quality levels
        for (let i = 0; i < data.levels.length; i++) {
          const level = data.levels[i];
          const option = document.createElement("option");
          option.value = i.toString();
          const height = level.height || "Unknown";
          const bitrate = level.bitrate ? `${Math.round(level.bitrate / 1000)}k` : "";
          option.textContent = `${height}p ${bitrate}`.trim();
          qualitySelect.appendChild(option);
        }

        qualityContainer.style.display = "block";

        // Handle quality change
        qualitySelect.onchange = () => {
          const selectedLevel = parseInt(qualitySelect.value);
          hls.currentLevel = selectedLevel;
          console.log(`Quality changed to level ${selectedLevel} for ${videoElement.id}`);
        };
      }

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
