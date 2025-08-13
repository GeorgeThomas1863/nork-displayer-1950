import { seekToTime } from "./vid-player.js";

/**
 * Play the video
 */
export const playVideo = (playerInstance) => {
  return playerInstance.videoElement.play();
};

/**
 * Pause the video
 */
export const pauseVideo = (playerInstance) => {
  return playerInstance.videoElement.pause();
};

/**
 * Seek to a specific time in the overall video timeline
 */
export const seekToTimeAPI = (playerInstance, time) => {
  return seekToTime(time, playerInstance);
};

/**
 * Get the current playback time across all chunks
 */
export const getCurrentTimeAPI = (playerInstance) => {
  return playerInstance.playerState.globalCurrentTime;
};

/**
 * Get the total duration of all chunks combined
 */
export const getTotalDurationAPI = (playerInstance) => {
  return playerInstance.totalDuration;
};

/**
 * Get the currently loaded chunk index
 */
export const getCurrentChunkAPI = (playerInstance) => {
  return playerInstance.playerState.currentChunkIndex;
};

/**
 * Check if the video is currently playing
 */
export const isPlayingAPI = (playerInstance) => {
  return !playerInstance.videoElement.paused;
};

/**
 * Set the volume (0.0 to 1.0)
 */
export const setVolumeAPI = (playerInstance, volume) => {
  playerInstance.videoElement.volume = Math.max(0, Math.min(1, volume));
};

/**
 * Get the current volume
 */
export const getVolumeAPI = (playerInstance) => {
  return playerInstance.videoElement.volume;
};

/**
 * Mute/unmute the video
 */
export const toggleMuteAPI = (playerInstance) => {
  playerInstance.videoElement.muted = !playerInstance.videoElement.muted;
  return playerInstance.videoElement.muted;
};

/**
 * Get information about all chunks
 */
export const getChunksInfoAPI = (playerInstance) => {
  return playerInstance.processedChunks.map((chunk) => ({
    chunkIndex: chunk.chunkIndex,
    chunkName: chunk.chunkName,
    duration: chunk.duration,
    globalStartTime: chunk.globalStartTime,
    globalEndTime: chunk.globalEndTime,
    sizeBytes: chunk.chunkSizeBytes,
  }));
};

/**
 * Jump to a specific chunk by index
 */
export const jumpToChunkAPI = (playerInstance, chunkIndex) => {
  if (chunkIndex >= 0 && chunkIndex < playerInstance.processedChunks.length) {
    const chunk = playerInstance.processedChunks[chunkIndex];
    return seekToTimeAPI(playerInstance, chunk.globalStartTime);
  }
};

/**
 * Skip forward by a number of seconds
 */
export const skipForwardAPI = (playerInstance, seconds = 10) => {
  const currentTime = getCurrentTimeAPI(playerInstance);
  const newTime = Math.min(currentTime + seconds, getTotalDurationAPI(playerInstance));
  return seekToTimeAPI(playerInstance, newTime);
};

/**
 * Skip backward by a number of seconds
 */
export const skipBackwardAPI = (playerInstance, seconds = 10) => {
  const currentTime = getCurrentTimeAPI(playerInstance);
  const newTime = Math.max(currentTime - seconds, 0);
  return seekToTimeAPI(playerInstance, newTime);
};

/**
 * Clean up and destroy the player
 */
export const destroyPlayerAPI = (playerInstance) => {
  // Clean up animation frame
  if (playerInstance.playerState.animationFrameId) {
    cancelAnimationFrame(playerInstance.playerState.animationFrameId);
  }

  // Clear container
  const container = playerInstance.videoElement.closest(".video-player-container");
  if (container) {
    container.innerHTML = "";
  }

  // Remove any remaining event listeners
  playerInstance.videoElement.src = "";
  playerInstance.videoElement.load();
};

/**
 * Add event listener to the video element
 */
export const addEventListenerAPI = (playerInstance, event, callback) => {
  playerInstance.videoElement.addEventListener(event, callback);
};

/**
 * Remove event listener from the video element
 */
export const removeEventListenerAPI = (playerInstance, event, callback) => {
  playerInstance.videoElement.removeEventListener(event, callback);
};
