// Runs at build time: merges leaderboard/data.json with participant records and ranks them.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import Leaderboard from './Leaderboard';

const read = p => JSON.parse(readFileSync(p, 'utf8'));
const pts = (p, w) => +p.points?.[w.id] || 0;

export default function Page() {
  const d = read('leaderboard/data.json');
  const ws = d.workshops || [];
  const participants = readdirSync('docs/participants').filter(f => f.endsWith('.json')).sort().map(f => {
    const p = read(`docs/participants/${f}`);
    if (p.id !== f.slice(0, -5)) throw new Error(`${f}: id "${p.id}" must match the file name`);
    const image = typeof p.image === 'string' && p.image.startsWith('/') && !p.image.split('/').includes('..') && existsSync(`public${p.image}`)
      ? `${process.env.BASE_PATH}${p.image}`
      : null;
    const ext = ['jpg', 'jpeg', 'png', 'webp'].find(e => existsSync(`public/photos/${p.id}.${e}`));
    p.photo = image || (ext ? `${process.env.BASE_PATH}/photos/${p.id}.${ext}` : null);
    return p;
  });
  // Total = sum of workshop points; ranks are unique. Tiebreak: latest workshop first, then ID.
  const rows = participants.map(p => ({ ...p, total: ws.reduce((n, w) => n + pts(p, w), 0) }))
    .sort((a, b) => b.total - a.total || [...ws].reverse().reduce((r, w) => r || pts(b, w) - pts(a, w), 0) || a.id.localeCompare(b.id));
  return <Leaderboard kicker={d.kicker} title={d.title} updated={d.updated} countdown={d.countdown} workshops={ws} rows={rows} />;
}
