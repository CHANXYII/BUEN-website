// Languages: en (the HTML itself), th, zh. Dictionaries map the English text to its translation.
// Any text not in a dictionary stays English. Add a string: add the same key to i18n/th.js and i18n/zh.js.
const DICT = {};
const LANGS = ['en', 'th', 'zh', 'ja', 'ko', 'fr', 'es', 'id', 'fil', 'vi', 'my', 'lo'];
const SHORT = { en: 'EN', th: 'ไทย', zh: '中文', ja: '日本語', ko: '한국어', fr: 'FR', es: 'ES', id: 'ID', fil: 'FIL', vi: 'VI', my: 'မြန်မာ', lo: 'ລາວ' };
const HTML_LANG = { en: 'en', th: 'th', zh: 'zh-Hans', ja: 'ja', ko: 'ko', fr: 'fr', es: 'es', id: 'id', fil: 'fil', vi: 'vi', my: 'my', lo: 'lo' };
const leaves = () => $$('body *').filter(e => !e.children.length && e.tagName !== 'SCRIPT' && (e.dataset.en || e.textContent.trim() in DICT.th));
let curLang = 'en';
const setLang = lang => {
  if (!LANGS.includes(lang)) lang = 'en';
  curLang = lang;
  leaves().forEach(e => {
    const en = e.dataset.en ||= e.textContent.trim();
    e.textContent = lang === 'en' ? en : DICT[lang][en] ?? en;
  });
  document.documentElement.lang = HTML_LANG[lang];
  document.title = lang === 'en' ? DICT.title : DICT[lang].title;
  $$('[data-lang]').forEach(b => { const on = b.dataset.lang === lang; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
  $('.lang-cur').textContent = SHORT[lang];
  try { localStorage.lang = lang; } catch {}
};
DICT.title = document.title;
