# KK Biryani — Reel Videos Folder

Drop your vertical video files (.mp4) into this folder.

## File Names Expected

| File name            | Used for         |
|----------------------|------------------|
| birthday-reel.mp4    | Birthday Parties |
| wedding-reel.mp4     | Weddings         |
| corporate-reel.mp4   | Corporate Events |

## How to Add Your Videos

1. Copy your .mp4 reel files into this `videos/` folder
2. Rename them to match the names above  
   (or change the `src="videos/..."` in index.html to match your filenames)
3. Reload the browser — the videos will appear in the reel cards

## Tips for Best Results

- Format: MP4 (H.264) — plays in all browsers
- Orientation: Vertical / Portrait (9:16 ratio) — matches the card shape perfectly
- Resolution: 1080 x 1920 is ideal; 720 x 1280 also works well
- File size: Try to keep each video under 20 MB for fast page loads
  - Use a free compressor like https://www.handbrake.fr/ or https://clideo.com/compress-video
- Duration: 15–60 seconds works best for looping reels

## Adding a 4th (or more) Reel

Duplicate this block in index.html and update the src, label, tag, and caption:

```html
<div class="reel-card" data-label="Your Event Type">
  <div class="reel-phone-frame">
    <video
      class="reel-video"
      src="videos/your-video.mp4"
      poster="https://..."  <!-- optional thumbnail image -->
      autoplay muted loop playsinline
      aria-label="Your reel description"
    ></video>
    <div class="reel-overlay"></div>
    <div class="reel-info">
      <span class="reel-tag">Your Event Type</span>
      <p class="reel-caption">Your caption here.</p>
    </div>
  </div>
</div>
```

Also add a matching dot in the `#reels-dots` div:

```html
<button class="reels-dot" data-reel="3" aria-label="Your reel label"></button>
```

