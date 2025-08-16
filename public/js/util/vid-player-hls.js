// HLS Video Player - Vanilla JavaScript with Dynamic HTML Creation
// Works with your backend data structure

// Global variables
let hls = null;
let elements = {};
let videoData = null;

// Initialize the player when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     // Check if HLS.js is loaded
//     if (!window.Hls) {
//         showError('HLS.js library not found. Make sure to include it in your HTML.');
//         return;
//     }
    
//     createPlayerHLS();
//     bindEvents();
// });

// Create all HTML elements dynamically
export const createPlayerHLS = () => {
    // Create main video container
    const vidContainer = document.createElement('div');
    vidContainer.className = 'vid-container';

    // Create title
    const title = document.createElement('h1');
    title.textContent = 'Video Player';
    vidContainer.appendChild(title);

    // Create video selector dropdown
    const selectorGroup = document.createElement('div');
    selectorGroup.className = 'input-group';

    const videoSelect = document.createElement('select');
    videoSelect.id = 'videoSelector';
    videoSelect.onchange = loadSelectedVideo;

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a video...';
    videoSelect.appendChild(defaultOption);
    
    elements.videoSelect = videoSelect;

    const loadBtn = document.createElement('button');
    loadBtn.className = 'btn btn-primary';
    loadBtn.textContent = 'Load Video';
    loadBtn.onclick = loadSelectedVideo;

    selectorGroup.appendChild(videoSelect);
    selectorGroup.appendChild(loadBtn);
    vidContainer.appendChild(selectorGroup);

    // Create video element
    const video = document.createElement('video');
    video.id = 'videoPlayer';
    video.className = 'video-player';
    video.controls = true;
    video.textContent = 'Your browser does not support the video tag.';
    elements.video = video;
    vidContainer.appendChild(video);

    // Create controls container
    const controls = document.createElement('div');
    controls.className = 'controls';

    // Create control buttons
    const playBtn = document.createElement('button');
    playBtn.className = 'btn btn-secondary';
    playBtn.textContent = 'Play';
    playBtn.onclick = playVideo;

    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'btn btn-secondary';
    pauseBtn.textContent = 'Pause';
    pauseBtn.onclick = pauseVideo;

    const reloadBtn = document.createElement('button');
    reloadBtn.className = 'btn btn-secondary';
    reloadBtn.textContent = 'Reload';
    reloadBtn.onclick = reloadVideo;

    // Create quality selector
    const qualitySelector = document.createElement('div');
    qualitySelector.className = 'quality-selector';

    const qualityLabel = document.createElement('label');
    qualityLabel.textContent = 'Quality: ';
    qualityLabel.htmlFor = 'qualitySelect';

    const qualitySelect = document.createElement('select');
    qualitySelect.id = 'qualitySelect';
    qualitySelect.onchange = changeQuality;
    
    const autoOption = document.createElement('option');
    autoOption.value = '-1';
    autoOption.textContent = 'Auto';
    qualitySelect.appendChild(autoOption);
    
    elements.qualitySelect = qualitySelect;

    qualitySelector.appendChild(qualityLabel);
    qualitySelector.appendChild(qualitySelect);

    // Append controls
    controls.appendChild(playBtn);
    controls.appendChild(pauseBtn);
    controls.appendChild(reloadBtn);
    controls.appendChild(qualitySelector);
    videoContainer.appendChild(controls);

    // Create status div
    const statusDiv = document.createElement('div');
    statusDiv.id = 'status';
    statusDiv.className = 'status';
    elements.statusDiv = statusDiv;
    videoContainer.appendChild(statusDiv);

    // Create video info container
    const videoInfo = document.createElement('div');
    videoInfo.id = 'videoInfo';
    videoInfo.className = 'video-info';

    const infoTitle = document.createElement('h3');
    infoTitle.textContent = 'Video Information';

    const infoContent = document.createElement('div');
    infoContent.id = 'infoContent';
    elements.infoContent = infoContent;

    videoInfo.appendChild(infoTitle);
    videoInfo.appendChild(infoContent);
    videoContainer.appendChild(videoInfo);

    elements.videoInfo = videoInfo;

    // Append to body
    document.body.appendChild(videoContainer);
};

// Function to populate video selector with your data
const populateVideoSelector = (data) => {
    videoData = data;
    
    data.forEach(dataGroup => {
        if (dataGroup.dataType === 'vids' || dataGroup.dataType === 'watch') {
            dataGroup.dataArray.forEach(videoItem => {
                const option = document.createElement('option');
                option.value = JSON.stringify(videoItem);
                
                // Create display text based on data type
                let displayText = '';
                if (dataGroup.dataType === 'vids') {
                    displayText = `KCNA: ${videoItem.title}`;
                } else if (dataGroup.dataType === 'watch') {
                    displayText = `Watch: ${videoItem.title} (${videoItem.type})`;
                }
                
                option.textContent = displayText;
                elements.videoSelect.appendChild(option);
            });
        }
    });
};

// Bind events after elements are created
const bindEvents = () => {
    setupVideoEvents();
};

// Check if HLS is supported
const isHLSSupported = () => window.Hls && window.Hls.isSupported();

// Show status message
const showStatus = (message, type = 'info') => {
    elements.statusDiv.textContent = message;
    elements.statusDiv.className = `status ${type}`;
    elements.statusDiv.style.display = 'block';
    
    if (type !== 'error') {
        setTimeout(() => {
            elements.statusDiv.style.display = 'none';
        }, 5000);
    }
};

// Load selected video from dropdown
const loadSelectedVideo = () => {
    const selectedValue = elements.videoSelect.value;
    if (!selectedValue) {
        showStatus('Please select a video', 'error');
        return;
    }

    try {
        const videoItem = JSON.parse(selectedValue);
        const manifestPath = videoItem.manifestPath;
        
        if (!manifestPath) {
            showStatus('No manifest path found for this video', 'error');
            return;
        }

        // Construct full URL - adjust this based on how your Express serves the manifest files
        const manifestUrl = `${window.location.origin}${manifestPath}`;
        loadHLSVideo(manifestUrl, videoItem);
        
    } catch (error) {
        console.error('Error parsing video data:', error);
        showStatus('Error loading video data', 'error');
    }
};

// Main function to load HLS video
const loadHLSVideo = (manifestUrl, videoItem = null) => {
    // Clean up existing HLS instance
    if (hls) {
        hls.destroy();
        hls = null;
    }

    // Clear quality selector
    elements.qualitySelect.innerHTML = '';
    const autoOption = document.createElement('option');
    autoOption.value = '-1';
    autoOption.textContent = 'Auto';
    elements.qualitySelect.appendChild(autoOption);
    
    elements.videoInfo.style.display = 'none';

    if (!isHLSSupported()) {
        // Check if the browser supports HLS natively (Safari)
        if (elements.video.canPlayType('application/vnd.apple.mpegurl')) {
            showStatus('Using native HLS support', 'success');
            elements.video.src = manifestUrl;
        } else {
            showStatus('HLS is not supported in this browser', 'error');
            return;
        }
    } else {
        // Use HLS.js
        hls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });

        hls.loadSource(manifestUrl);
        hls.attachMedia(elements.video);
        setupHLSEvents();
        
        showStatus('Loading HLS video...', 'info');
    }

    // Update video info if we have video data
    if (videoItem) {
        updateVideoInfoFromData(videoItem);
    }
};

// Setup HLS.js specific events
const setupHLSEvents = () => {
    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        showStatus(`Manifest loaded. Found ${data.levels.length} quality level(s)`, 'success');
        
        // Populate quality selector
        data.levels.forEach((level, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${level.height}p (${Math.round(level.bitrate / 1000)}k)`;
            elements.qualitySelect.appendChild(option);
        });
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        
        if (data.fatal) {
            switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                    showStatus('Network error occurred. Trying to recover...', 'error');
                    hls.startLoad();
                    break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                    showStatus('Media error occurred. Trying to recover...', 'error');
                    hls.recoverMediaError();
                    break;
                default:
                    showStatus(`Fatal error: ${data.details}`, 'error');
                    hls.destroy();
                    break;
            }
        } else {
            console.warn('Non-fatal HLS error:', data.details);
        }
    });

    hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        console.log(`Quality switched to level ${data.level}`);
    });
};

// Setup video element events
const setupVideoEvents = () => {
    elements.video.addEventListener('loadstart', () => {
        showStatus('Starting to load video...', 'info');
    });

    elements.video.addEventListener('loadedmetadata', () => {
        showStatus('Video metadata loaded', 'success');
    });

    elements.video.addEventListener('canplay', () => {
        showStatus('Video ready to play', 'success');
    });

    elements.video.addEventListener('error', (e) => {
        console.error('Video error:', e);
        showStatus('Video playback error occurred', 'error');
    });

    elements.video.addEventListener('waiting', () => {
        showStatus('Buffering...', 'info');
    });

    elements.video.addEventListener('playing', () => {
        elements.statusDiv.style.display = 'none';
    });
};

// Update video information display from your data
const updateVideoInfoFromData = (videoItem) => {
    let infoHtml = `<strong>Title:</strong> ${videoItem.title}<br>`;
    
    if (videoItem.vidData) {
        infoHtml += `<strong>Size:</strong> ${videoItem.vidData.vidSizeMB}MB<br>`;
        if (videoItem.vidData.totalChunks) {
            infoHtml += `<strong>Chunks:</strong> ${videoItem.vidData.totalChunks}<br>`;
        }
        if (videoItem.vidData.downloadChunks) {
            infoHtml += `<strong>Chunks:</strong> ${videoItem.vidData.downloadChunks}<br>`;
        }
    }
    
    if (videoItem.date) {
        const date = new Date(videoItem.date);
        infoHtml += `<strong>Date:</strong> ${date.toLocaleDateString()}<br>`;
    }
    
    if (videoItem.type) {
        infoHtml += `<strong>Type:</strong> ${videoItem.type}<br>`;
    }
    
    elements.infoContent.innerHTML = infoHtml;
    elements.videoInfo.style.display = 'block';
};

// Control functions
const playVideo = () => {
    elements.video.play().catch(error => {
        console.error('Error playing video:', error);
        showStatus('Error playing video', 'error');
    });
};

const pauseVideo = () => {
    elements.video.pause();
};

const reloadVideo = () => {
    const selectedValue = elements.videoSelect.value;
    if (selectedValue) {
        loadSelectedVideo();
    } else {
        showStatus('No video selected to reload', 'error');
    }
};

const changeQuality = () => {
    if (!hls) return;
    
    const selectedLevel = parseInt(elements.qualitySelect.value);
    hls.currentLevel = selectedLevel;
    
    if (selectedLevel === -1) {
        console.log('Auto quality selection enabled');
    } else {
        console.log(`Manual quality changed to level ${selectedLevel}`);
    }
};

// Export function for external use
window.initVideoPlayer = (data) => {
    if (elements.videoSelect) {
        populateVideoSelector(data);
    } else {
        // If elements aren't ready yet, wait and try again
        setTimeout(() => window.initVideoPlayer(data), 100);
    }
};

// Utility function to show error
const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 4px;
        margin: 20px;
        border: 1px solid #f5c6cb;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
};