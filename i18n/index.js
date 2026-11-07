// Languages. English is the text in content/ and components/; every other language is a dictionary that maps
// that exact English text to its translation (i18n/<code>.js). Text missing from a dictionary stays English.
// Add a language: create i18n/<code>.js (copy fr.js) and add one line below.
import th from './th';
import zh from './zh';
import ja from './ja';
import ko from './ko';
import fr from './fr';
import es from './es';
import id from './id';
import fil from './fi';
import vi from './vi';
import my from './my';
import lo from './lo';

// code: saved choice and browser match; short: header button; label: dropdown; html: <html lang>.
export const LANGS = [
  { code: 'en', short: 'EN', label: 'English', html: 'en', dict: {} },
  { code: 'th', short: 'ไทย', label: 'ไทย', html: 'th', dict: th },
  { code: 'zh', short: '中文', label: '中文 (简体)', html: 'zh-Hans', dict: zh },
  { code: 'ja', short: '日本語', label: '日本語', html: 'ja', dict: ja },
  { code: 'ko', short: '한국어', label: '한국어', html: 'ko', dict: ko },
  { code: 'fr', short: 'FR', label: 'Français', html: 'fr', dict: fr },
  { code: 'es', short: 'ES', label: 'Español', html: 'es', dict: es },
  { code: 'id', short: 'ID', label: 'Bahasa Indonesia', html: 'id', dict: id },
  { code: 'fi', short: 'FI', label: 'Filipino', html: 'fil', dict: fil },
  { code: 'vi', short: 'VI', label: 'Tiếng Việt', html: 'vi', dict: vi },
  { code: 'my', short: 'မြန်မာ', label: 'မြန်မာ', html: 'my', dict: my },
  { code: 'lo', short: 'ລາວ', label: 'ລາວ', html: 'lo', dict: lo },
];

// Content may use non-breaking spaces to control line breaks; dictionary keys use plain spaces.
export const key = s => s.replace(/ /g, ' ');
