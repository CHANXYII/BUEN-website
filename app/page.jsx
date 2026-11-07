import Link from 'next/link';
import { requireJudge, config, participants, scores, total } from './lib';
import Bar, { Pic } from './Bar';
import WorkshopSelect from './WorkshopSelect';

export default async function Home({ searchParams }) {
  const me = await requireJudge();
  const { title, criteria, workshops } = config();
  const selected = (await searchParams)?.workshop || workshops[0].id;
  const workshop = workshops.find(w => w.id === selected) || workshops[0];
  const s = scores();
  return (<>
    <Bar me={me} />
    <main className="wrap">
      <div className="lb-head"><p className="eyebrow">Participants</p><h1>{title}</h1><p className="lead">Choose a workshop, then select a participant to enter a score. Maximum {total(Object.fromEntries(criteria.map(c => [c.id, c.max])), criteria)} points per workshop.</p></div>
      <WorkshopSelect workshops={workshops} selected={workshop.id} />
      <div className="participant-grid">{participants().map(p => { const mine=s[p.id]?.[workshop.id]?.[me]; const by=Object.values(s[p.id]?.[workshop.id]||{}); return <Link className="participant-card" key={p.id} href={`/p/${p.id}?workshop=${workshop.id}`}><span className="pic"><Pic p={p} /></span><span><span className="id">{p.id}</span><strong translate="no">{p.name}</strong>{p.major&&<small>{p.major}</small>}<span className={`score-status ${mine?'submitted':'not-scored'}`}>{mine?'Submitted':'Not scored'}</span><em>{by.length} judge{by.length===1?'':'s'} submitted</em></span></Link>; })}</div>
    </main>
  </>);
}
