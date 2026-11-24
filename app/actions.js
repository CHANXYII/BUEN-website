'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { checkLogin, sign, requireJudge, config, participants, setScore, stepOf } from './lib';

export async function login(fd) {
  const name = String(fd.get('name') || '').trim();
  if (!checkLogin(name, String(fd.get('password') || ''))) redirect('/login?error=1');
  (await cookies()).set('judge', `${name}.${sign(name)}`, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 12 });
  redirect('/');
}

export async function logout() {
  (await cookies()).delete('judge');
  redirect('/login');
}

// Save this judge's score. Each value snaps to the criterion's step (0.5 by default) inside 0..max; the optional note is
// kept to 500 characters. "Save & next" (go=next) continues to the next participant in list order.
export async function save(fd) {
  const me = await requireJudge();
  const id = String(fd.get('id'));
  const workshop = String(fd.get('workshop') || '');
  const list = participants(), i = list.findIndex(p => p.id === id);
  if (i < 0) throw new Error('Unknown participant');
  if (!config().workshops.some(w => w.id === workshop)) throw new Error('Unknown workshop');
  const vals = Object.fromEntries(config().criteria.map(c => {
    const v = fd.get(c.id);
    if (v === null || v === '') throw new Error(`Missing score for ${c.name}`);
    const step = stepOf(c);
    return [c.id, Math.min(c.max, Math.max(0, Math.round((+v || 0) / step) * step))];
  }));
  const note = String(fd.get('note') || '').trim().slice(0, 500);
  if (note) vals.note = note;
  setScore(me, id, workshop, vals);
  const next = fd.get('go') === 'next' && list[i + 1];
  redirect(`/p/${next ? next.id : id}?workshop=${encodeURIComponent(workshop)}&saved=${id}`);
}
