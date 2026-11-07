// Score board for one participant: this judge's score form + every judge's scores and the average.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireJudge, config, participants, scores, total } from '../../lib';
import { save } from '../../actions';
import Bar, { Pic } from '../../Bar';

export default async function Score({ params, searchParams }) {
  const me = await requireJudge();
  const { id } = await params, { saved, workshop: workshopId } = await searchParams;
  const p = participants().find(x => x.id === id);
  if (!p) notFound();
  const { criteria, workshops } = config();
  const workshop = workshops.find(w => w.id === workshopId) || workshops[0];
  const by = Object.entries(scores()[id]?.[workshop.id] || {}), mine = Object.fromEntries(by)[me] || {};
  const avg = f => by.length ? (by.reduce((n, [, v]) => n + f(v), 0) / by.length).toFixed(1) : '–';
  return (<>
    <Bar me={me} />
    <main className="wrap">
      <p className="back"><Link href={`/?workshop=${workshop.id}`}>&larr; All participants</Link></p>
      <div className="score-layout"><form action={save} className="sheet">
        <h2>{workshop.name} · Your score</h2>
        <p className="score-context"><strong>Status:</strong> {Object.keys(mine).length ? 'Submitted' : 'Not scored'} · <strong>Other judges submitted:</strong> {Math.max(0, by.length - (Object.keys(mine).length ? 1 : 0))} · <strong>Current average:</strong> {avg(v => total(v, criteria))} / {total(Object.fromEntries(criteria.map(c => [c.id, c.max])), criteria)}</p>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="workshop" value={workshop.id} />
        {criteria.map(c => (
          <label key={c.id}><span>{c.name} <small>/ {c.max}</small></span>
            <input type="number" name={c.id} min="0" max={c.max} step="any" required defaultValue={mine[c.id]} />
          </label>
        ))}
        <div className="row"><button className="btn primary">Save score</button>{saved && <span className="ok" role="status">Saved</span>}</div>
      </form><aside className="participant-banner"><img src="/participant-placeholder.png" alt="Participant banner" /><div><strong>{p.name}</strong><small>{p.id}</small>{p.major && <span>{p.major}</span>}</div></aside></div>

      <h2>Score board</h2>
      <div className="lb-scroll"><table className="lb">
        <thead><tr><th>Judge</th>{criteria.map(c => <th className="num" key={c.id}>{c.name}</th>)}<th className="num">Total</th></tr></thead>
        <tbody>
          {by.length ? by.map(([j, v]) => (
            <tr key={j} className={j === me ? 'mine' : undefined}>
              <td>{j}</td>
              {criteria.map(c => <td className="num" key={c.id}>{v[c.id] ?? '–'}</td>)}
              <td className="num">{total(v, criteria)}</td>
            </tr>
          )) : <tr><td colSpan={criteria.length + 2}>No scores yet.</td></tr>}
        </tbody>
        {by.length > 0 && <tfoot><tr><td>Average</td>{criteria.map(c => <td className="num" key={c.id}>{avg(v => +v[c.id] || 0)}</td>)}<td className="num">{avg(v => total(v, criteria))}</td></tr></tfoot>}
      </table></div>
    </main>
  </>);
}
