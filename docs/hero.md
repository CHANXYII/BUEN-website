# Hero: featured BU news

- Markup: `src/sections/hero.html`
- Style: `src/styles/hero.css`
- Script: `app/sections/hero.js`

Three welcome banners (Welcome to the School / Hello! We’re BUEN Ambassador / Hi! We’re BUEN Student Committee) that auto-advance (7 s per slide, numbered index with a progress line at the bottom; pauses on hover, focus or while the video is open). Click a segment to jump.

- **Official BU video:** put the YouTube video ID in `data-yt` on the first `<article class="hslide">`. The "Watch official video" button opens it in a pop-up (empty ID shows "Video coming soon").
- **Cover photo:** save the image as `src/assets/hero.png` (landscape, about 1920x1080 or larger, under 500 KB if possible). It sits behind all slides at 45% opacity, fading to black at the bottom. For a different photo on one slide, add `style="--bg:url(assets/news/1.jpg)"` to that `<article class="hslide">`.
- **Edit a story:** change the `<h1>`, `.lead` and button link of the slide, and the same keys in `app/i18n/th.js` and `zh.js`.
- Slide texts are **placeholders** (marked `TODO`). Replace with real BU news.
