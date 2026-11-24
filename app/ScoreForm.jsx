'use client';
// This judge's score form: tap a value per criterion (0, 0.5 ... max), see the total update live, add an optional
// note, then "Save" (stay) or "Save & next" (go to the next participant). Criteria arrive with their `steps` worked out
// on the server. Key this component by participant + workshop so its state resets when either changes.
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

const fmt = n => +n.toFixed(2);

function Buttons({ hasNext }) {
  const { pending, data } = useFormStatus();
  const going = pending && data?.get('go');
  return (
    <div className="save-row">
      <button className={`btn${hasNext ? '' : ' primary'}`} name="go" value="stay" disabled={pending}>{going === 'stay' ? 'Saving…' : 'Save'}</button>
      {hasNext && <button className="btn primary" name="go" value="next" disabled={pending}>{going === 'next' ? 'Saving…' : 'Save & next'}</button>}
    </div>
  );
}

export default function ScoreForm({ action, id, workshop, criteria, initial, max, hasNext, children }) {
  const [vals, setVals] = useState(() => Object.fromEntries(criteria.map(c => [c.id, initial?.[c.id]])));
  const sum = criteria.reduce((n, c) => n + (vals[c.id] ?? 0), 0);
  const left = criteria.filter(c => vals[c.id] == null).length;
  return (
    <form action={action} className="sheet score-form">
      {children}
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="workshop" value={workshop} />
      {criteria.map(c => (
        <fieldset key={c.id} className="crit">
          <legend><span>{c.name}</span><small>{vals[c.id] ?? '–'} / {c.max}</small></legend>
          {c.desc && <p className="desc">{c.desc}</p>}
          <div className="steps" style={{ '--n': c.steps.length }}>
            {c.steps.map(v => (
              <label key={v} className={v % 1 ? 'half' : undefined}>
                <input type="radio" name={c.id} value={v} required checked={vals[c.id] === v} onChange={() => setVals({ ...vals, [c.id]: v })} />
                <span>{v}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <label className="note"><span>Comment <small>optional, other judges see it</small></span>
        <textarea name="note" rows="3" maxLength="500" defaultValue={initial?.note || ''} placeholder="e.g. strong presentation, demo needs work" />
      </label>
      <div className="live-total" aria-live="polite">
        <span>Your total</span>
        <strong>{fmt(sum)}<small> / {max}</small></strong>
        {left > 0 && <em>{left} to score</em>}
      </div>
      <Buttons hasNext={hasNext} />
    </form>
  );
}
