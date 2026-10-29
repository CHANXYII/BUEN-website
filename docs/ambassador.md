# BUEN Ambassador (main section)

- Markup: `src/sections/ambassador.html`
- Style: `src/styles/ambassador.css` (card styles are shared with the Committee section)
- Script: `app/sections/ambassador.js`

Placed first after the hero. Five blocks, each reveals on scroll:

1. **What is BUEN Ambassador?** intro text and three perks.
2. **Our presidents**: looping slideshow (autoplay 5 s, pauses on hover, arrows, dots, swipe). One `<article class="slide">` per president. Now: Generation 1 (current) and a "Coming soon, opening in 2027" slide for Generation 2. When Generation 2 opens, replace that slide (remove `upcoming`, add the real president) and make Generation 1 a former president.
3. **Ambassadors by generation**: one tab button (`data-gen`) and one `.gen-panel` (same `data-gen`) per generation. Generation 1 is shown by default. Generation 2 shows a "coming soon" note until it opens in 2027 (replace the `.soon-panel` with a `.people` grid of members).
4. **Our work by generation**: photo gallery per generation tab. Put photos in `src/assets/gallery/` and replace a placeholder `<figure class="shot">` (see the comment in the HTML). The first photo shows large.
5. **About Us video**: list the YouTube video IDs, space-separated, in `data-yt` on `.vids`. Plays as a looping playlist: arrows or a video ending jump to the next one and play it. Autoplays muted 2s after scrolling into view (not with reduced motion). The player loads on click. Empty means "Video coming soon".
6. **About text and major cards**: under the video in `#amb-video` (`.about` paragraphs, `.majors` list). Each string needs its translation in every `app/i18n/*.js`.

All names, generations, years, quotes and events are **placeholders** ("Student Name"). Replace the avatar `<svg>` with `<img src="assets/ambassadors/name.jpg" alt="">` once photos exist.
