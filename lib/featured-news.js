import { load } from 'cheerio';

const SOURCE_URL = 'https://www.bu.ac.th/th/engineering/featured-stories';
const MONTHS = {
  'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
  'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12,
};

function parseDate(value) {
  const match = value.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})/u);
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
  return value.replace(/\s+/g, ' ').trim();
}

export async function getFeaturedStories() {
  try {
    const response = await fetch(SOURCE_URL, {
      cache: 'force-cache',
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return [];

    const $ = load(await response.text());
    const source = new URL(SOURCE_URL);

    return $('.pagination-content a')
      .filter((_, element) => $(element).attr('href')?.includes('/engineering/featured-stories/'))
      .map((_, element) => {
        const card = $(element);
        const title = normalizeText(card.find('[class*="text-card-title"]')
          .filter((_, node) => !($(node).attr('class') || '').includes('text-card-title-sm'))
          .first().text());
        const excerpt = normalizeText(card.find('[class*="text-card-title-sm"]').first().text());
        const dateText = card.find('span').map((_, node) => normalizeText($(node).text())).get()
          .find(value => parseDate(value));
        const parsedDate = dateText ? parseDate(dateText) : null;

        let link = '';
        let image = '';
        try {
          const url = new URL(card.attr('href'), source);
          if (url.origin === source.origin && url.pathname.startsWith('/th/engineering/featured-stories/')) {
            link = url.href;
          }
        } catch {}
        try {
          const url = new URL(card.find('img.bu-card-image').attr('src'), source);
          if (url.protocol === 'https:' && url.hostname === 'contents.bu.ac.th') image = url.href;
        } catch {}

        return { title, excerpt, date: dateText || '', dateTime: parsedDate?.dateTime || '', timestamp: parsedDate?.timestamp || 0, image, link };
      })
      .get()
      .filter(story => story.title && story.excerpt && story.dateTime && story.image && story.link)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map(({ timestamp, ...story }) => story);
  } catch {
    return [];
  }
}