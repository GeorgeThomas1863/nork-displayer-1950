// vid-player-api.js
// API functions for controlling the video player
// NOTE: No imports needed - all methods are on the playerInstance

/**
 * Play the video
 */
export const playVideo = (playerInstance) => {
  if (!playerInstance) {
    console.error("No player instance provided");
    return;
  }
  return playerInstance.play();
};

/**
 * Pause the video
 */
export const pauseVideo = (playerInstance) => {
  if (!playerInstance) {
    console.error("No player instance provided");
    return;
  }
  return playerInstance.pause();
};

/**
 * Seek to a specific time in the overall video timeline
 */
export const seekToTimeAPI = (playerInstance, time) => {
  if (!playerInstance) {
    console.error("No player instance provided");
    return;
  }
  return playerInstance.seekTo(time);
};

/**
 * Get the current playback time across all chunks
 */
export const getCurrentTimeAPI = (playerInstance) => {
  if (!playerInstance) {
    console.error("No player instance provided");
    return 0;
  }
  return playerInstance.getCurrentTime();
};

/**
 * Get the total duration of all chunks combined
 */
export const getTotalDurationAPI = (playerInstance) => {
  if (!playerInstance) {
    console.error("No player instance provided");
    return 0;
  }
  return playerInstance.getTotalDuration();
};

/**
 * Get the currently loaded chunk index
 */
export const getCurrentChunkAPI = (playerInstance) => {
  if (!playerInstance || !playerInstance.playerState) {
    console.error("No player instance or playerState provided");
    return -1;
  }
  return playerInstance.playerState.currentChunkIndex;
};

/**
 * Check if the video is currently playing
 */
export const isPlayingAPI = (playerInstance) => {
  if (!playerInstance || !playerInstance.videoElement) {
    console.error("No player instance or videoElement provided");
    return false;
  }
  return !playerInstance.videoElement.paused;
};

/**
 * Set the volume (0.0 to 1.0)
 */
export const setVolumeAPI = (playerInstance, volume) => {
  if (!playerInstance || !playerInstance.videoElement) {
    console.error("No player instance or videoElement provided");
    return;
  }
  playerInstance.videoElement.volume = Math.max(0, Math.min(1, volume));
};

/**
 * Get the current volume
 */
export const getVolumeAPI = (playerInstance) => {
  if (!playerInstance || !playerInstance.videoElement) {
    console.error("No player instance or videoElement provided");
    return 0;
  }
  return playerInstance.videoElement.volume;
};

/**
 * Mute/unmute the video
 */
export const toggleMuteAPI = (playerInstance) => {
  if (!playerInstance || !playerInstance.videoElement) {
    console.error("No player instance or videoElement provided");
    return false;
  }
  playerInstance.videoElement.muted = !playerInstance.videoElement.muted;
  return playerInstance.videoElement.muted;
};

/**
 * Set mute state explicitly
 */
export const setMuteAPI = (playerInstance, muted) => {
  if (!playerInstance || !playerInstance.videoElement) {
    console.error("No player instance or videoElement provided");
    return;
  }
  playerInstance.videoElement.muted = muted;
};

/**
 * Get information about all chunks
 */
export const getChunksInfoAPI = (playerInstance) => {
  if (!playerInstance || !playerInstance.processedChunks) {
    console.error("No player instance or processedChunks provided");
    return [];
  }

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
 * Get information about current chunk
 */
export const getCurrentChunkInfoAPI = (playerInstance) => {
  if (!playerInstance || !playerInstance.playerState || !playerInstance.processedChunks) {
    console.error("No player instance, playerState, or processedChunks provided");
    return null;
  }

  const currentIndex = playerInstance.playerState.currentChunkIndex;
  if (currentIndex >= 0 && currentIndex < playerInstance.processedChunks.length) {
    const chunk = playerInstance.processedChunks[currentIndex];
    return {
      chunkIndex: chunk.chunkIndex,
      chunkName: chunk.chunkName,
      duration: chunk.duration,
      globalStartTime: chunk.globalStartTime,
      globalEndTime: chunk.globalEndTime,
      sizeBytes: chunk.chunkSizeBytes,
    };
  }

  return null;
};

/**
 * Jump to a specific chunk by index
 */
export const jumpToChunkAPI = (playerInstance, chunkIndex) => {
  if (!playerInstance || !playerInstance.processedChunks) {
    console.error("No player instance or processedChunks provided");
    return;
  }

  if (chunkIndex >= 0 && chunkIndex < playerInstance.processedChunks.length) {
    const chunk = playerInstance.processedChunks[chunkIndex];
    return playerInstance.seekTo(chunk.globalStartTime);
  } else {
    console.error(`Invalid chunk index: ${chunkIndex}. Valid range: 0-${playerInstance.processedChunks.length - 1}`);
  }
};

/**
 * Skip forward by a number of seconds
 */
export const skipForwardAPI = (playerInstance, seconds = 10) => {
  if (!playerInstance) {
    console.error("No player instance provided");
    return;
  }

  const currentTime = playerInstance.getCurrentTime();
  const newTime = Math.min(currentTime + seconds, playerInstance.getTotalDuration());
  return playerInstance.seekTo(newTime);
};

/**
 * Skip backward by a number of seconds
 */
export const skipBackwardAPI = (playerInstance, seconds = 10) => {
  if (!playerInstance) {
    console.error("No player instance provided");
    return;
  }

  const currentTime = playerInstance.getCurrentTime();
  const newTime = Math.max(currentTime - seconds, 0);
  return playerInstance.seekTo(newTime);
};

/**
 * Get playback progress as percentage (0-100)
 */
export const getProgressPercentAPI = (playerInstance) => {
  if (!playerInstance) {
    console.error("No player instance provided");
    return 0;
  }

  const current = playerInstance.getCurrentTime();
  const total = playerInstance.getTotalDuration();

  if (total > 0) {
    return (current / total) * 100;
  }

  return 0;
};

/**
 * Set playback speed
 */
export const setPlaybackSpeedAPI = (playerInstance, speed) => {
  if (!playerInstance || !playerInstance.videoElement) {
    console.error("No player instance or videoElement provided");
    return;
  }

  // Clamp speed between 0.25x and 4x
  const clampedSpeed = Math.max(0.25, Math.min(4, speed));
  playerInstance.videoElement.playbackRate = clampedSpeed;
  return clampedSpeed;
};

/**
 * Get current playback speed
 */
export const getPlaybackSpeedAPI = (playerInstance) => {
  if (!playerInstance || !playerInstance.videoElement) {
    console.error("No player instance or videoElement provided");
    return 1;
  }

  return playerInstance.videoElement.playbackRate;
};

/**
 * Clean up and destroy the player
 */
export const destroyPlayerAPI = (playerInstance) => {
  if (!playerInstance) {
    console.error("No player instance provided");
    return;
  }

  return playerInstance.destroy();
};

/**
 * Add event listener to the video element
 */
export const addEventListenerAPI = (playerInstance, event, callback) => {
  if (!playerInstance || !playerInstance.videoElement) {
    console.error("No player instance or videoElement provided");
    return;
  }

  playerInstance.videoElement.addEventListener(event, callback);
};

/**
 * Remove event listener from the video element
 */
export const removeEventListenerAPI = (playerInstance, event, callback) => {
  if (!playerInstance || !playerInstance.videoElement) {
    console.error("No player instance or videoElement provided");
    return;
  }

  playerInstance.videoElement.removeEventListener(event, callback);
};

/**
 * Get player state information
 */
export const getPlayerStateAPI = (playerInstance) => {
  if (!playerInstance || !playerInstance.playerState) {
    console.error("No player instance or playerState provided");
    return null;
  }

  return {
    currentChunkIndex: playerInstance.playerState.currentChunkIndex,
    globalCurrentTime: playerInstance.playerState.globalCurrentTime,
    isUserSeeking: playerInstance.playerState.isUserSeeking,
    isDestroyed: playerInstance.playerState.isDestroyed,
  };
};

/**
 * Check if the player is ready
 */
export const isPlayerReadyAPI = (playerInstance) => {
  if (!playerInstance || !playerInstance.videoElement) {
    return false;
  }

  return playerInstance.videoElement.readyState >= 2;
};
