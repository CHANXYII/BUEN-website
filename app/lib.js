// Server-only helpers: config, participants, judge sessions, score storage.
import { readFileSync, writeFileSync, renameSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const read = p => JSON.parse(readFileSync(p, 'utf8'));
export const config = () => read('judging.json');

export const participants = () => readdirSync('docs/participants').filter(f => f.endsWith('.json')).sort().map(f => {
  const p = read(`docs/participants/${f}`);
  const ext = ['jpg', 'jpeg', 'png', 'webp'].find(e => existsSync(`public/photos/${p.id}.${e}`));
  if (ext) p.photo = `${process.env.BASE_PATH}/photos/${p.id}.${ext}`;
  return p;
});

// Judges come from env JUDGES="name:password,name2:password2". Sessions are an HMAC-signed cookie (SESSION_SECRET).
const judges = () => Object.fromEntries((process.env.JUDGES || '').split(',').filter(s => s.includes(':')).map(s => {
  const i = s.indexOf(':');
  return [s.slice(0, i).trim(), s.slice(i + 1)];
}));
const eq = (a, b) => timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
export const sign = name => {
  if (!process.env.SESSION_SECRET) throw new Error('Set SESSION_SECRET');
  return createHmac('sha256', process.env.SESSION_SECRET).update(name).digest('base64url');
};
// ponytail: no login rate limit; fine for a few admin-set judge passwords, add one if this goes public-facing.
export const checkLogin = (name, pw) => Object.hasOwn(judges(), name) && eq(judges()[name], pw);

export async function judge() {
  const v = (await cookies()).get('judge')?.value || '';
  const i = v.lastIndexOf('.'), name = v.slice(0, i);
  return i > 0 && Object.hasOwn(judges(), name) && eq(v.slice(i + 1), sign(name)) ? name : null;
}
export const requireJudge = async () => (await judge()) || redirect('/login');

// Scores: data/scores.json = { [participantId]: { [judge]: { [criterionId]: number } } }.
// ponytail: single JSON file, one server process; move to a DB if you run several instances.
const FILE = 'data/scores.json';
export const scores = () => (existsSync(FILE) ? read(FILE) : {});
export function setScore(judgeName, id, workshop, vals) {
  const s = scores();
  (((s[id] ||= {})[workshop] ||= {})[judgeName]) = vals;
  mkdirSync('data', { recursive: true });
  writeFileSync(FILE + '.tmp', JSON.stringify(s, null, 2));
  renameSync(FILE + '.tmp', FILE); // atomic swap: a crash mid-write never corrupts the file
}
export const total = (vals, criteria) => criteria.reduce((n, c) => n + (+vals?.[c.id] || 0), 0);
