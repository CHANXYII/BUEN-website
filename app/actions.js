'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { checkLogin, sign, requireJudge, config, participants, setScore } from './lib';

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

export async function save(fd) {
  const me = await requireJudge();
  const id = String(fd.get('id'));
  const workshop = String(fd.get('workshop') || '');
  if (!participants().some(p => p.id === id)) throw new Error('Unknown participant');
  if (!config().workshops.some(w => w.id === workshop)) throw new Error('Unknown workshop');
  const vals = Object.fromEntries(config().criteria.map(c => [c.id, Math.min(c.max, Math.max(0, +fd.get(c.id) || 0))]));
  setScore(me, id, workshop, vals);
  redirect(`/p/${id}?workshop=${encodeURIComponent(workshop)}&saved=1`);
}
