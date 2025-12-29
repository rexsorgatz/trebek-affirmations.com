# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Trebek Affirmation Soundboard - a static single-page PWA that plays Alex Trebek audio clips from Jeopardy. The site is designed to look like a Jeopardy game board where clicking tiles plays affirmation sound clips. Hosted at trebek-affirmations.com.

## Architecture

**Main files:**
- `index.html` - Single-page application with embedded CSS and JavaScript
- `manifest.json` - PWA manifest for installability
- `sw.js` - Service worker for offline audio caching
- `robots.txt` - Allows all crawlers

**CSS Architecture** (embedded in index.html):
- Uses CSS custom properties (variables) defined in `:root` for colors, fonts, spacing
- CSS Grid layout for the game board (6-column grid)
- Absolute positioning for card text centering (required for flip animation)
- Responsive breakpoints at 1200px and 700px
- Includes `prefers-reduced-motion` media query for accessibility

**JavaScript Architecture** (embedded in index.html):
- Vanilla JS for core audio playback (no jQuery dependency for audio)
- jQuery only used for the Flip plugin card animations
- Audio managed via single `currentAudio` variable to prevent memory leaks
- Keyboard accessibility: Enter/Space triggers sound buttons

**External dependencies** (loaded from CDNs):
- jQuery 3.6.0 (with SRI hash)
- jquery.flip.min.js (for card flip animations)

**Local assets**: All media files (MP3, images, fonts) served locally from root directory.

## Development

No build process - open `index.html` directly in a browser or use a local server.

All assets are served locally. Audio files use relative paths (e.g., `yes.mp3`).

## Key Implementation Details

- **Audio playback**: Reuses single Audio object to prevent memory leaks; previous audio stops when new clip plays
- **Card flip**: jQuery Flip plugin with auto-flip-back after 4 seconds (uses clearTimeout to prevent race conditions)
- **Tile fade-in**: Random delay animation using `requestAnimationFrame` on page load
- **Easter eggs**: Hidden audio triggers in header/footer via `.easter-egg` class
- **Accessibility**: ARIA labels on all buttons, keyboard navigation (Tab/Enter/Space), visible focus states
- **PWA**: Service worker caches audio files on first play for offline support
