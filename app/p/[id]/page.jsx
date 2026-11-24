// Score page for one participant: banner (with previous / next), this judge's score form, and the score board.
// Other judges' scores stay hidden until this judge has submitted, so nobody is swayed by them.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireJudge, config, participants, scores, total, maxTotal, stepOf, fmt } from '../../lib';
import { save } from '../../actions';
import Bar, { Fig } from '../../Bar';
import ScoreForm from '../../ScoreForm';

export default async function Score({ params, searchParams }) {
  const me = await requireJudge();
  const { id } = await params, { saved, workshop: workshopId } = await searchParams;
  const list = participants(), i = list.findIndex(x => x.id === id), p = list[i];
  if (!p) notFound();
  const { criteria, workshops } = config();
  const workshop = workshops.find(w => w.id === workshopId) || workshops[0];
  const q = `?workshop=${workshop.id}`, prev = list[i - 1], next = list[i + 1];
  const by = Object.entries(scores()[id]?.[workshop.id] || {}), mine = Object.fromEntries(by)[me];
  const others = by.length - (mine ? 1 : 0), max = maxTotal(criteria);
  const avg = f => (by.length ? fmt(by.reduce((n, [, v]) => n + f(v), 0) / by.length) : '–');
  const notes = by.filter(([, v]) => v.note);
  return (<>
    <Bar me={me} />
    <main className="wrap">
      <div className="topline">
        <p className="back"><Link href={`/${q}`}>&larr; All participants</Link></p>
        <nav className="p-nav" aria-label="Participants">
          {prev ? <Link href={`/p/${prev.id}${q}`} aria-label={`Previous: ${prev.id}`}>&larr;</Link> : <span aria-hidden="true">&larr;</span>}
          <span className="count">{i + 1} / {list.length}</span>
          {next ? <Link href={`/p/${next.id}${q}`} aria-label={`Next: ${next.id}`}>&rarr;</Link> : <span aria-hidden="true">&rarr;</span>}
        </nav>
      </div>
      {saved && <p className="toast" role="status">✓ Score saved{saved !== id && ` for ${saved}`}</p>}
      <div className={`p-banner pb${p.cutout ? ' cut' : ''}`}>
        <Fig p={p} />
        <div className="txt">
          <p className="eyebrow">{p.id} · {workshop.name}</p>
          <h1 translate="no">{p.name}</h1>
          {p.major && <p className="major">{p.major}</p>}
        </div>
      </div>

      <div className="score-layout">
        <ScoreForm key={`${id}:${workshop.id}`} action={save} id={id} workshop={workshop.id} max={max} hasNext={!!next} initial={mine}
          criteria={criteria.map(c => {
            const step = stepOf(c);
            return { ...c, steps: Array.from({ length: Math.round(c.max / step) + 1 }, (_, k) => fmt(k * step)) };
          })}>
          <h2>{workshop.name} · Your score</h2>
          <p className="score-context"><span className={`score-status ${mine ? 'submitted' : 'not-scored'}`}>{mine ? 'Submitted' : 'Not scored'}</span> {mine ? 'Change any score and save again.' : 'Tap a score for each topic.'}</p>
        </ScoreForm>

        <section className="board" aria-labelledby="board-h">
          <h2 id="board-h">Score board</h2>
          {!mine ? (
            <p className="locked">{others ? `${others} judge${others === 1 ? ' has' : 's have'} scored ${p.id}. ` : 'No judge has scored yet. '}Submit your score to see everyone's scores and the average.</p>
          ) : (<>
            <div className="lb-scroll"><table className="lb">
              <thead><tr><th>Judge</th>{criteria.map(c => <th className="num" key={c.id}>{c.name}</th>)}<th className="num">Total</th></tr></thead>
              <tbody>
                {by.map(([j, v]) => (
                  <tr key={j} className={j === me ? 'mine' : undefined}>
                    <td>{j}</td>
                    {criteria.map(c => <td className="num" key={c.id}>{v[c.id] ?? '–'}</td>)}
                    <td className="num">{fmt(total(v, criteria))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td>Average</td>{criteria.map(c => <td className="num" key={c.id}>{avg(v => +v[c.id] || 0)}</td>)}<td className="num">{avg(v => total(v, criteria))} <small>/ {max}</small></td></tr></tfoot>
            </table></div>
            {notes.length > 0 && <ul className="notes">{notes.map(([j, v]) => <li key={j}><strong>{j}</strong><p>{v.note}</p></li>)}</ul>}
          </>)}
        </section>
      </div>
    </main>
  </>);
}
