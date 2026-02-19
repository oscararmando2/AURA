/**
 * Hero Video Control Script
 * Control hero video playback (play from second 1 to second 25)
 * Enhanced for cross-device compatibility - removes play button on all devices
 */
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.getElementById('hero-video');
    // Delay before retrying play on pause (allows browser to settle)
    const PAUSE_RETRY_DELAY_MS = 100;
    
    if (heroVideo) {
        // Track if video loaded successfully and if play was already attempted
        let videoLoaded = false;
        let playAttempted = false;
        
        // Remove controls attribute programmatically (ensures no controls appear)
        heroVideo.controls = false;
        heroVideo.setAttribute('webkit-playsinline', 'true');
        heroVideo.setAttribute('x-webkit-airplay', 'deny');
        
        // Set start time to 1 second when video is loaded
        heroVideo.addEventListener('loadedmetadata', function() {
            videoLoaded = true;
            heroVideo.currentTime = 1;
            console.log('✅ Video loaded successfully');
            // Ensure video plays after metadata loads
            attemptPlay();
        });
        
        // Also try on canplay event (consolidated from multiple events)
        heroVideo.addEventListener('canplay', function() {
            if (!playAttempted) {
                attemptPlay();
            }
        });
        
        // Monitor playback and loop from second 1 to 25
        heroVideo.addEventListener('timeupdate', function() {
            // If video reaches 25 seconds or beyond, reset to 1 second
            if (heroVideo.currentTime >= 25) {
                heroVideo.currentTime = 1;
            }
        });
        
        // If video is paused for any reason, try to resume
        heroVideo.addEventListener('pause', function() {
            // Only try to resume if the video was loaded and is within playback range
            if (videoLoaded && heroVideo.currentTime >= 1 && heroVideo.currentTime < 25) {
                setTimeout(function() {
                    attemptPlay();
                }, PAUSE_RETRY_DELAY_MS);
            }
        });
        
        // Function to attempt playing the video with fallback
        function attemptPlay() {
            if (heroVideo.paused) {
                playAttempted = true;
                const playPromise = heroVideo.play();
                if (playPromise !== undefined) {
                    playPromise.then(function() {
                        console.log('✅ Video autoplay successful');
                    }).catch(function(error) {
                        console.log('Video autoplay was prevented:', error.message);
                        // Try again on user interaction
                        setupUserInteractionFallback();
                    });
                }
            }
        }
        
        // Setup fallback for browsers that require user interaction
        function setupUserInteractionFallback() {
            const startPlayback = function() {
                attemptPlay();
                // Remove listeners after first interaction
                document.removeEventListener('touchstart', startPlayback);
                document.removeEventListener('click', startPlayback);
                document.removeEventListener('scroll', startPlayback);
            };
            
            document.addEventListener('touchstart', startPlayback, { passive: true, once: true });
            document.addEventListener('click', startPlayback, { once: true });
            document.addEventListener('scroll', startPlayback, { passive: true, once: true });
        }
        
        // Detect video load errors
        heroVideo.addEventListener('error', function(e) {
            console.warn('⚠️ Video failed to load');
            console.warn('📁 Expected location: videoaura155.mp4');
            console.warn('📖 Instructions: See DOWNLOAD_VIDEO_FIRST.md or video-missing.html');
            console.warn('🔗 Download from: https://www.pexels.com/video/8746842/download/');
            
            // Show a subtle notification to developers
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                setTimeout(function() {
                    if (!videoLoaded) {
                        console.log('%c🎬 AURA Studio - Video Missing', 'font-size: 16px; font-weight: bold; color: #EFE9E1;');
                        console.log('%cThe background video is not playing because the file is missing.', 'font-size: 14px;');
                        console.log('%cTo fix this:', 'font-size: 14px; font-weight: bold;');
                        console.log('%c1. Download: https://www.pexels.com/video/8746842/download/', 'font-size: 13px;');
                        console.log('%c2. Save as: videoaura155.mp4', 'font-size: 13px;');
                        console.log('%c3. Or run: ./download-video.sh or python download-video.py', 'font-size: 13px;');
                        console.log('%cFor detailed instructions, open: video-missing.html', 'font-size: 13px; font-style: italic;');
                    }
                }, 1000);
            }
        });
        
        // Ensure video starts at second 1
        heroVideo.currentTime = 1;
        
        // Initial play attempt
        attemptPlay();
        
        // Check if video is actually loading after a delay
        setTimeout(function() {
            if (!videoLoaded && heroVideo.readyState === 0) {
                console.warn('⚠️ Video may be missing or failed to load');
                console.log('%c📖 Open video-missing.html for instructions', 'font-size: 14px; color: #2196F3; font-weight: bold;');
            }
        }, 2000);
    }
});
