import { load } from 'cheerio';

// ============================================================================
// [Archive category configuration] Paste story URLs into the arrays below,
// separated by commas.
// ============================================================================
export const ARCHIVE_LINKS = {
  pride: [
    'https://www.bu.ac.th/th/featured-stories/2641',
  ],
  news: [
    'https://www.bu.ac.th/th/featured-stories/2131',
    'https://www.bu.ac.th/th/featured-stories/2656',
    'https://www.bu.ac.th/th/featured-stories/2325',
  ],
  insight: [
    'https://www.bu.ac.th/th/featured-stories/1584',
    'https://www.bu.ac.th/th/featured-stories/1669',
    'https://www.bu.ac.th/th/featured-stories/1882',
    'https://www.bu.ac.th/th/featured-stories/2046',
    'https://www.bu.ac.th/th/featured-stories/2111',
    'https://www.bu.ac.th/th/featured-stories/2514',
    'https://www.bu.ac.th/th/featured-stories/2515',
    'https://www.bu.ac.th/th/featured-stories/2563',
  ],
};

const MAIN_SOURCE = 'https://www.bu.ac.th/th/engineering/featured-stories';
const EXTRA_LINKS = [];

const MONTHS = {
  'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
  'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12,
};

function parseDate(value) {
  const match = value?.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})/u);
  if (!match || !MONTHS[match[2]]) return null;

  const day = Number(match[1]);
  const year = Number(match[3]) - 543;
  const month = MONTHS[match[2]];
  return {
    dateTime: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    timestamp: Date.UTC(year, month - 1, day),
  };
}

function normalizeText(value) {
  return value?.replace(/\s+/g, ' ').trim() || '';
}

async function fetchWithRetry(url, options, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(20000),
      });
      if (response.ok) return response;
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
    }
  }
}

function parseSingleArticleHtml(html, link) {
  const $ = load(html);
  const title = normalizeText($('h1').first().text())
    || normalizeText($('title').text().split('|')[0]);
  const excerpt = normalizeText($('meta[property="og:description"]').attr('content')
    || $('meta[name="description"]').attr('content'));
  let image = $('meta[property="og:image"]').attr('content');

  try {
    if (image && !image.startsWith('http')) image = new URL(image, link).href;
  } catch {
    image = '';
  }

  const articleDateText = normalizeText(
    $('section.content [class*="tw:md:col-span-3"] [class*="tw:text-base-700"]')
      .first().text()
  );
  const date = articleDateText.match(/\d{1,2}\s+[^\s]+\s+\d{4}/u)?.[0] || '';
  const parsedDate = parseDate(date);

  if (!title || !image) return null;

  return {
    title,
    excerpt,
    date,
    dateTime: parsedDate?.dateTime || '',
    timestamp: parsedDate?.timestamp || 0,
    image,
    link,
  };
}

let fetchPromiseCache = null;

export async function getFeaturedStories() {
  if (fetchPromiseCache) return fetchPromiseCache;

  const requestPromise = (async () => {
    const errorMessage = 'Failed to fetch featured stories from BU website';
    const fetchOptions = { cache: 'force-cache' };
    const bustToken = Date.now();
    const sources = [MAIN_SOURCE, ...EXTRA_LINKS];
    const responses = await Promise.all(
      sources.map(url => fetchWithRetry(`${url}?_bust=${bustToken}`, fetchOptions))
    );

    const htmls = await Promise.all(responses.map(response => response.text()));
    const allExtractedStories = [];

    const $main = load(htmls[0]);
    const mainUrl = new URL(MAIN_SOURCE);
    const mainStories = $main('.pagination-content a')
      .map((_, element) => {
        const card = $main(element);
        const title = normalizeText(card.find('[class*="text-card-title"]')
          .filter((_, node) => !($main(node).attr('class') || '').includes('text-card-title-sm'))
          .first().text());
        const excerpt = normalizeText(card.find('[class*="text-card-title-sm"]').first().text());
        const dateMatch = card.find('span')
          .map((_, node) => normalizeText($main(node).text()))
          .get()
          .map(date => {
            const parsed = parseDate(date);
            return parsed ? { date, parsed } : null;
          })
          .find(Boolean);

        let link = '';
        let image = '';
        try {
          link = new URL(card.attr('href'), mainUrl).href;
        } catch {}
        try {
          let rawImageSource = card.find('img.bu-card-image').attr('data-src')
            || card.find('img.bu-card-image').attr('src');
          if (rawImageSource) rawImageSource = rawImageSource.replace('/_thumbs/', '/');
          const imageUrl = new URL(rawImageSource, mainUrl);
          if (imageUrl.protocol === 'https:') image = imageUrl.href;
        } catch {}

        return {
          title,
          excerpt,
          date: dateMatch?.date || '',
          dateTime: dateMatch?.parsed?.dateTime || '',
          timestamp: dateMatch?.parsed?.timestamp || 0,
          image,
          link,
        };
      })
      .get();

    allExtractedStories.push(...mainStories);

    htmls.slice(1).forEach((html, index) => {
      const article = parseSingleArticleHtml(html, EXTRA_LINKS[index]);
      if (article) allExtractedStories.push(article);
    });

    const validStories = allExtractedStories.filter(story =>
      story.title && story.dateTime && story.image && story.link
    );
    const uniqueStories = Array.from(new Map(validStories.map(story => [story.link, story])).values());
    const stories = uniqueStories.sort((a, b) => b.timestamp - a.timestamp);

    if (stories.length === 0) throw new Error(errorMessage);
    return stories;
  })();

  const cachedPromise = requestPromise.catch(error => {
    if (fetchPromiseCache === cachedPromise) fetchPromiseCache = null;
    throw error;
  });
  fetchPromiseCache = cachedPromise;
  return cachedPromise;
}

let archivePromiseCache = null;

export async function getArchiveStories() {
  if (archivePromiseCache) return archivePromiseCache;

  const requestPromise = (async () => {
    const fetchOptions = { cache: 'force-cache' };
    const bustToken = Date.now();
    const categorizedStories = { pride: [], news: [], insight: [] };

    for (const [category, links] of Object.entries(ARCHIVE_LINKS)) {
      if (!links?.length) continue;

      const responses = await Promise.all(
        links.map(link => fetchWithRetry(`${link}?_bust=${bustToken}`, fetchOptions))
      );
      const htmls = await Promise.all(responses.map(response => response.text()));

      htmls.forEach((html, index) => {
        const article = parseSingleArticleHtml(html, links[index]);
        if (article) categorizedStories[category].push(article);
      });

      categorizedStories[category].sort((a, b) => b.timestamp - a.timestamp);
    }

    return categorizedStories;
  })();

  const cachedPromise = requestPromise.catch(error => {
    if (archivePromiseCache === cachedPromise) archivePromiseCache = null;
    throw error;
  });
  archivePromiseCache = cachedPromise;
  return cachedPromise;
}