# News & Events

Featured stories are scraped from the BU Engineering news page at build time.

- Scraper and parser: `lib/featured-news.js` (Cheerio)
- Server-rendered section: `components/News.jsx`
- Interactive slider: `components/FeaturedNewsSlider.jsx`
- Styles: `styles/news.css`
- UI translations: `i18n/*.js`

`npm run build` fetches and parses the latest stories into the static export. If the BU page cannot be fetched or no valid stories are found, the build fails rather than publishing an empty news section. Rebuild and deploy to refresh the stories.
