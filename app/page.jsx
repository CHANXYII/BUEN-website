// Participant list for the logged-in judge. Click a name to open their score board.
import Link from 'next/link';
import { requireJudge, config, participants, scores, total } from './lib';
import Bar, { Pic } from './Bar';

export default async function Home() {
  const me = await requireJudge();
  const { title, criteria } = config();
  const s = scores(), max = total(Object.fromEntries(criteria.map(c => [c.id, c.max])), criteria);
  return (<>
    <Bar me={me} />
    <main className="wrap">
      <div className="lb-head">
        <p className="eyebrow">Participants</p>
        <h1>{title}</h1>
        <p className="lead">Pick a participant to score. Max {max} points.</p>
      </div>
      <div className="lb-scroll"><table className="lb">
        <thead><tr><th></th><th>Participant</th><th className="num">Your score</th><th className="num">Judges</th><th className="num">Average</th></tr></thead>
        <tbody>{participants().map(p => {
          const by = Object.values(s[p.id] || {}), mine = s[p.id]?.[me];
          return (
            <tr key={p.id}>
              <td className="pic"><Pic p={p} /></td>
              <td><Link className="who" href={`/p/${p.id}`}>
                <span className="id">{p.id}</span><strong translate="no">{p.name}</strong>
                {p.major && <small>{p.major}</small>}
              </Link></td>
              <td className="num">{mine ? total(mine, criteria) : '–'}</td>
              <td className="num">{by.length}</td>
              <td className="num">{by.length ? (by.reduce((n, v) => n + total(v, criteria), 0) / by.length).toFixed(1) : '–'}</td>
            </tr>
          );
        })}</tbody>
      </table></div>
    </main>
  </>);
}
