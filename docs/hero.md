# Hero: featured BU news

- Content: `content/hero.js`
- Component: `components/Hero.jsx`
- Style: `styles/hero.css`

Welcome slides that auto-advance (7 s per slide, numbered index with a progress line; pauses on hover, focus or while the video is open). Click a segment to jump.

- **Edit a slide:** change `eyebrow`, `title`, `lead`, `tab` and `buttons` in `slides`, and the same English keys in every `i18n/*.js`. Buttons with a `#section` link stay on the page; other links open in a new tab.
- **Official BU video:** set `video` on a slide to the YouTube video ID. A slide with a `video` key gets a "Watch official video" button that opens a pop-up (`''` shows "Video coming soon").
- **Cover photo:** `public/assets/hero.png` (landscape, about 1920x1080, under 500 KB if possible), behind all slides at 45% opacity. For a different photo on one slide, add `image: '/assets/news/1.jpg'`.
- Slide texts are **placeholders** (marked `TODO`).
