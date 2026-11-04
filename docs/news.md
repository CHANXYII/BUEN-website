# News & Events

- Content: `content/news.js`
- Component: `components/News.jsx`
- Style: `styles/news.css`

1. **Featured BU news** (`feature`): the main BU story about the School of Engineering. Edit the title, text, date and `link` (the article URL). Photo: put it in `public/assets/news/` and set `image: '/assets/news/feature.jpg'` (16:10 works best); until then a crimson tint shows.
2. **More news** (`items`): one entry per item, newest first. `date` is ISO (`2026-10-01`); `dateLabel` is what shows.

Texts are **placeholders**. When you change an English text, change the same key in every `i18n/*.js` too.
