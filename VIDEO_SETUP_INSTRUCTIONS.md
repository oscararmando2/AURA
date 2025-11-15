# Video Background Setup Instructions

## Overview
The homepage hero section now includes a video background that plays from second 1 to second 25 on loop. The welcome text ("Bienvenida", "Pilates a tu medida", "Fortalece tu cuerpo y mente con Pilates", "Reserva tu clase") is displayed in the foreground over the video.

## Required Action: Download the Video

**⚠️ IMPORTANT:** The video file is not included in the repository due to its size. You need to download it manually.

### Quick Download
1. **Download the video:** https://www.pexels.com/video/8746842/download/
2. **Save it as:** `pilates-background.mp4`
3. **Location:** Place it in the `assets/videos/` directory

### Step-by-Step Instructions

#### Windows:
1. Click the download link: https://www.pexels.com/video/8746842/download/
2. Your browser will download the file (usually to your Downloads folder)
3. Rename the file to `pilates-background.mp4`
4. Move it to: `[Your Repository]/assets/videos/pilates-background.mp4`

#### Mac/Linux:
1. Open Terminal
2. Navigate to the repository:
   ```bash
   cd /path/to/AURA
   ```
3. Download the video:
   ```bash
   curl -L -o assets/videos/pilates-background.mp4 "https://www.pexels.com/video/8746842/download/"
   ```

#### Using Python (if curl doesn't work):
```python
import requests

url = "https://www.pexels.com/video/8746842/download/"
response = requests.get(url, stream=True)
with open("assets/videos/pilates-background.mp4", "wb") as f:
    for chunk in response.iter_content(chunk_size=8192):
        f.write(chunk)
print("Video downloaded successfully!")
```

## What's Been Implemented

### 1. Video Element
- Added HTML5 video element to the hero section
- Configured with `autoplay`, `muted`, and `playsinline` attributes
- Video covers the full section background

### 2. Playback Control
- JavaScript automatically starts video at second 1
- Loops back to second 1 when reaching second 25
- Seamless looping for continuous playback

### 3. Visual Enhancements
- Semi-transparent gradient overlay for text readability
- Enhanced text shadows for better visibility
- Text remains in foreground (z-index: 2)
- Video in background (z-index: 0)

### 4. Fallback
- If video is not available, the original gradient background is displayed
- If autoplay is blocked by browser, gradient background is visible

## Testing

After downloading the video:

1. **Open the website** in a browser
2. **Verify** the video plays in the background
3. **Check** that text is clearly visible over the video
4. **Confirm** the video loops from second 1 to 25
5. **Test** on mobile devices to ensure responsiveness

## Troubleshooting

### Video doesn't play
- **Check file location:** Ensure `pilates-background.mp4` is in `assets/videos/`
- **Check file name:** Must be exactly `pilates-background.mp4` (case-sensitive)
- **Browser autoplay policy:** Some browsers block autoplay. Video should still show after user interaction
- **Check console:** Open browser DevTools (F12) and check for errors

### Text is not visible
- The overlay and text shadows are configured for readability
- If issues persist, you can adjust the overlay opacity in CSS:
  ```css
  .hero-overlay {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(254, 245, 245, 0.5) 50%, rgba(251, 227, 227, 0.5) 100%);
  }
  ```

### Video doesn't loop correctly
- Check browser console for JavaScript errors
- The loop is controlled by the `timeupdate` event listener
- Video should automatically reset to second 1 when reaching second 25

## File Structure
```
AURA/
├── assets/
│   └── videos/
│       ├── README.md                    (Detailed download instructions)
│       └── pilates-background.mp4       (⚠️ DOWNLOAD THIS FILE)
├── index.html                           (Updated with video background)
└── VIDEO_SETUP_INSTRUCTIONS.md          (This file)
```

## Next Steps

1. ✅ Download the video using one of the methods above
2. ✅ Place it in `assets/videos/` directory
3. ✅ Open `index.html` in a web browser
4. ✅ Verify the video plays and looks good
5. ✅ Test on different devices and browsers
6. ✅ Commit and deploy your changes

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify the video file exists and is named correctly
3. Ensure your web server is serving video files properly
4. Try opening the video file directly in the browser to confirm it works

---

**Video Source:** Pexels (Free to use)  
**Video ID:** 8746842  
**License:** Free to use (Pexels License)
