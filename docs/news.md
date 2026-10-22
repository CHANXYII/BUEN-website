# News & Events

- Markup: `src/sections/news.html`
- Style: `src/styles/news.css`
- Script: `app/sections/news.js`

Two parts:

1. **Featured BU news** (`<article class="feature">`): the main BU story about the School of Engineering. Edit the title, text, date and the "Read on BU website" link (use the article URL). Photo: save as `src/assets/news/feature.jpg` (16:10 works best); until then a crimson tint shows.
2. **More news**: one `<li>` per item, newest first (keep `datetime` in ISO format).

Texts are **placeholders**. When you change an English text, change the same key in `app/i18n/th.js` and `zh.js` too.
