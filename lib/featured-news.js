import { load } from 'cheerio';

// ============================================================================
// [Archive category configuration] Paste story URLs into the arrays below,
// separated by commas.
// ============================================================================
export const ARCHIVE_LINKS = {
  pride: [
    'https://www.bu.ac.th/th/featured-stories/2641',
    'https://www.bu.ac.th/th/featured-stories/2442',
    'https://www.bu.ac.th/th/featured-stories/2423',
    'https://www.bu.ac.th/th/featured-stories/2273',
    'https://www.bu.ac.th/th/featured-stories/2246',
    'https://www.bu.ac.th/th/featured-stories/2183',
    'https://www.bu.ac.th/th/featured-stories/1796',
    'https://www.bu.ac.th/th/featured-stories/1150',
    'https://www.bu.ac.th/th/featured-stories/1074',
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

function resolveUrl(value, base) {
  if (!value) return '';
  try {
    return new URL(value, base).href;
  } catch {
    return '';
  }
}

function isSafeStoryLink(link) {
  if (!link) return false;
  try {
    const urlObj = new URL(link);
    return urlObj.protocol === 'https:' && urlObj.hostname === 'www.bu.ac.th'
      && !urlObj.port && !urlObj.username && !urlObj.password
      && (urlObj.pathname.startsWith('/th/engineering/featured-stories/')
        || urlObj.pathname.startsWith('/th/featured-stories/'));
  } catch {
    return false;
  }
}

function isSafeImageUrl(imgUrl) {
  if (!imgUrl) return false;
  try {
    const urlObj = new URL(imgUrl);
    return urlObj.protocol === 'https:' && urlObj.hostname === 'contents.bu.ac.th'
      && !urlObj.port && !urlObj.username && !urlObj.password;
  } catch {
    return false;
  }
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
  if (!isSafeStoryLink(link)) return null;

  const $ = load(html);
  const title = normalizeText($('title').text().split('|')[0])
    || normalizeText($('h1').first().text());
  const excerpt = normalizeText($('meta[property="og:description"]').attr('content')
    || $('meta[name="description"]').attr('content'));
  const image = resolveUrl($('meta[property="og:image"]').attr('content'), link);

  const articleDateText = normalizeText(
    $('section.content [class*="tw:md:col-span-3"] [class*="tw:text-base-700"]')
      .first().text()
  );
  const date = articleDateText.match(/\d{1,2}\s+[^\s]+\s+\d{4}/u)?.[0] || '';
  const parsedDate = parseDate(date);

  if (!title || !isSafeImageUrl(image)) return null;

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
    const fetchOptions = { cache: 'force-cache', redirect: 'error' };
    
    // Removed cache-busting token to allow Next.js cache to work properly
    const response = await fetchWithRetry(MAIN_SOURCE, fetchOptions);
    const html = await response.text();
    const allExtractedStories = [];

    const $main = load(html);
    const mainUrl = new URL(MAIN_SOURCE);
    const mainStories = $main('.pagination-content a')
      .map((_, element) => {
        const card = $main(element);
        
        const link = resolveUrl(card.attr('href'), mainUrl);

        if (!isSafeStoryLink(link)) return null;

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

        const rawImageSource = card.find('img.bu-card-image').attr('data-src')
          || card.find('img.bu-card-image').attr('src');
        const image = resolveUrl(rawImageSource?.replace('/_thumbs/', '/'), mainUrl);

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
      .get()
      .filter(Boolean); // Remove nulls from unsafe links

    allExtractedStories.push(...mainStories);

    const validStories = allExtractedStories.filter(story =>
      story.title && story.dateTime && isSafeImageUrl(story.image) && story.link
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
    const fetchOptions = { cache: 'force-cache', redirect: 'error' };
    const categorizedStories = { pride: [], news: [], insight: [] };

    for (const [category, links] of Object.entries(ARCHIVE_LINKS)) {
      if (!links?.length) continue;

      const results = await Promise.allSettled(links.map(async link => {
        if (!isSafeStoryLink(link)) throw new Error('Untrusted story URL');
        const response = await fetchWithRetry(link, fetchOptions);
        const article = parseSingleArticleHtml(await response.text(), link);
        if (!article) throw new Error('Missing title or trusted image');
        return article;
      }));

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          categorizedStories[category].push(result.value);
        } else {
          console.warn(`Failed to load archive story ${links[index]}:`, result.reason);
        }
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
