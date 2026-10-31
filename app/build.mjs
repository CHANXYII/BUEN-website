// Static build: src/ + app/ -> deploy/site/. No dependencies. Run: node app/build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const out = new URL('deploy/site/', root);
const read = p => readFileSync(new URL(p, root), 'utf8');
const write = (p, s) => writeFileSync(new URL(p, out), s);

// Page order. Add a section: add its name here and create the matching files in src/ and app/sections/.
const header = 'header', footer = 'footer';
const main = ['hero', 'ambassador', 'committee', 'news', 'contact'];
const all = [header, ...main, footer];

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

write('index.html', read('src/index.html')
  .replace('{{header}}', () => read(`src/sections/${header}.html`))
  .replace('{{main}}', () => main.map(s => read(`src/sections/${s}.html`)).join('\n'))
  .replace('{{footer}}', () => read(`src/sections/${footer}.html`)));
write('styles.css', ['base', ...all].map(s => read(`src/styles/${s}.css`)).join('\n'));
write('app.js', `(() => {\n${['lib', 'i18n', 'i18n/th', 'i18n/zh', 'i18n/ja', 'i18n/ko', 'i18n/fr', 'i18n/es', 'i18n/id', 'i18n/fil', 'i18n/vi', 'i18n/my', 'i18n/lo', ...all.map(s => `sections/${s}`), 'init'].map(f => read(`app/${f}.js`)).join('\n')}\n})();\n`);

if (existsSync(new URL('src/assets', root))) cpSync(new URL('src/assets', root), new URL('assets', out), { recursive: true });
cpSync(new URL('src/font-th', root), new URL('font-th', out), { recursive: true, filter: f => !f.endsWith('.DS_Store') });
if (existsSync(new URL('deploy/CNAME', root))) cpSync(new URL('deploy/CNAME', root), new URL('CNAME', out)); // custom domain, later
write('.nojekyll', '');
console.log('built deploy/site');
