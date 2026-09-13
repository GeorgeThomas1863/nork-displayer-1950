const DATA_ROUTE = "/nork-watch-smoke-data-route";
const LOAD_COUNT = 5;

export const loadWatchVideos = async () => {
  const statusElement = document.querySelector("#status");
  const watchListElement = document.querySelector("#watch-list");
  if (!statusElement || !watchListElement) return;

  showStatus(statusElement, "Loading watch videos...");

  try {
    const watchVideos = await fetchWatchVideos();
    renderWatchVideos(watchVideos, watchListElement, statusElement);
  } catch (error) {
    showStatus(statusElement, "Unable to load watch videos.");
  }
};

const fetchWatchVideos = async () => {
  const response = await fetch(DATA_ROUTE, {
    method: "POST",
    body: JSON.stringify({ howMany: LOAD_COUNT }),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Watch video request failed");
  return response.json();
};

const renderWatchVideos = (watchVideos, watchListElement, statusElement) => {
  if (!Array.isArray(watchVideos) || !watchVideos.length) {
    showStatus(statusElement, "No watch videos found.");
    return;
  }

  showStatus(statusElement, "");
  for (const watchVideo of watchVideos) {
    watchListElement.append(buildWatchVideo(watchVideo));
  }
};

const buildWatchVideo = (watchVideo) => {
  const itemElement = document.createElement("article");
  const titleElement = document.createElement("h2");
  const detailsElement = document.createElement("p");
  const videoElement = document.createElement("video");

  titleElement.textContent = watchVideo.title || "Untitled";
  detailsElement.textContent = `${watchVideo.date || "Unknown date"} - ${watchVideo.vidType || "Unknown type"}`;
  videoElement.controls = true;
  videoElement.preload = "metadata";
  videoElement.src = watchVideo.mediaUrl;

  itemElement.append(titleElement, detailsElement, videoElement);
  return itemElement;
};

const showStatus = (statusElement, message) => {
  statusElement.textContent = message;
};

loadWatchVideos();
