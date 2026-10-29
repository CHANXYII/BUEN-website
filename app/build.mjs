// Static build: leaderboard/ + src/styles/base.css + app/ -> deploy/site/. No dependencies. Run: node app/build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const out = new URL('deploy/site/', root);
const read = p => readFileSync(new URL(p, root), 'utf8');
const write = (p, s) => writeFileSync(new URL(p, out), s);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(new URL('leaderboard/index.html', root), new URL('index.html', out));
mkdirSync(new URL('judge/', out), { recursive: true });
cpSync(new URL('judge/index.html', root), new URL('judge/index.html', out));
cpSync(new URL('judge/score.html', root), new URL('judge/score.html', out));
cpSync(new URL('judge/judge.js', root), new URL('judge/judge.js', out));
cpSync(new URL('judge/judge.css', root), new URL('judge/judge.css', out));
write('styles.css', ['src/styles/base.css', 'leaderboard/leaderboard.css'].map(read).join('\n'));

// data.json = leaderboard/data.json (title, workshops) + one file per participant in docs/participants/BUENxx.json
const participants = readdirSync(new URL('docs/participants/', root)).filter(f => f.endsWith('.json')).sort().map(f => {
  const p = JSON.parse(read(`docs/participants/${f}`));
  if (p.id !== f.slice(0, -5)) throw new Error(`${f}: id "${p.id}" must match the file name`);
  const ext = ['jpg', 'jpeg', 'png', 'webp'].find(e => existsSync(new URL(`docs/participants/photos/${p.id}.${e}`, root)));
  if (ext) p.photo = `photos/${p.id}.${ext}`; // photo = docs/participants/photos/BUENxx.(jpg|png|webp), optional
  return p;
});
if (existsSync(new URL('docs/participants/photos', root))) cpSync(new URL('docs/participants/photos', root), new URL('photos', out), { recursive: true });
write('data.json', JSON.stringify({ ...JSON.parse(read('leaderboard/data.json')), participants }));

// app.js: helpers, translations (app/i18n/*.js, hardcoded dictionaries), page, then init (applies saved language)
const langs = ['th', 'zh', 'ja', 'ko', 'fr', 'es', 'id', 'fil', 'vi', 'my', 'lo'];
write('app.js', `(() => {\n${[read('app/lib.js'), read('app/i18n.js'), ...langs.map(l => read(`app/i18n/${l}.js`)), read('leaderboard/leaderboard.js'), read('app/init.js')].join('\n')}\n})();\n`);

if (existsSync(new URL('deploy/CNAME', root))) cpSync(new URL('deploy/CNAME', root), new URL('CNAME', out)); // custom domain, later
write('.nojekyll', '');
console.log('built deploy/site');
