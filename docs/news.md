# News & Events

- Markup: `src/sections/news.html`
- Style: `src/styles/news.css`
- Script and featured story data: `app/sections/news.js`

**Featured News** is a one-card-at-a-time carousel. Edit the `featuredStories` array in `app/sections/news.js`; each item has a title, description, ISO date, display date, image URL, and original BU article URL. Cards open the article in a new tab. If an image fails to load, the card displays a branded fallback instead. The carousel advances every five seconds, pauses while hovered, focused, or the page is hidden, and respects reduced-motion preferences.

Stories are curated manually from [BU Featured Stories](https://www.bu.ac.th/th/featured-stories); this static site does not scrape the page or request a live feed. Update the array when BU publishes new stories. Use BU's original article URL and image URL.

**More News** stays separate in `src/sections/news.html`: add one linked `<li>` per item, newest first, and keep each `<time datetime>` value in ISO format. Links open in a new tab.

English story titles and descriptions fall back to English in locales without matching dictionary entries. Add translations to the locale dictionaries when translating new story content.
