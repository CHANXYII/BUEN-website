/* Supabase setup: replace these two values with your project's public URL and anon key. */
const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';
const $ = s => document.querySelector(s);
const status = m => { $('#status').textContent = m; };
// Preview mode is intentionally unlocked. Turn this off when Supabase auth is ready.
const DEMO = true;
if (DEMO) status('Demo mode: scores are saved only in this browser.');
const db = !DEMO && SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const load = async () => {
  if (DEMO) {
    if ($('#login')) $('#login').hidden = true; if ($('#scoring')) $('#scoring').hidden = false; $('#workshopName').textContent = 'Workshop 1 · Demo scoring';
    const response = await fetch('../data.json');
    if (!response.ok) throw new Error('Could not load participant data.');
    const d = await response.json();
    const saved = JSON.parse(localStorage.demoScores || '{}');
    $('#scores').innerHTML = d.participants.map(p => `<div class="score-row"><span class="participant"><span class="avatar"><img src="${p.photo ? `../${p.photo}` : `../photos/${p.id}.jpg`}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="avatar-fallback">${p.id.replace(/\D/g, '')}</span></span><span><strong>${p.id} — ${p.name}</strong><small>${p.major || ''}</small></span></span><input required min="0" type="number" step="0.01" data-id="${p.id}" value="${saved[p.id]?.points ?? p.points?.w1 ?? ''}" placeholder="Score"><textarea data-comment="${p.id}" placeholder="Comment for this participant">${saved[p.id]?.comment ?? ''}</textarea></div>`).join('');
    return;
  }
  const { data: { user } } = await db.auth.getUser();
  if (!user) return;
  const { data, error } = await db.from('judge_assignments').select('workshop_id, workshops(id,name), scores(participant_id,points)').eq('judge_id', user.id).eq('status','open').single();
  if (error || !data) return status('No open workshop has been assigned to this judge.');
  $('#login').hidden = true; $('#scoring').hidden = false; $('#workshopName').textContent = data.workshops.name;
  const { data: people } = await db.from('participants').select('id,name,major').order('id');
  $('#scores').innerHTML = (people || []).map(p => { const old = data.scores?.find(s => s.participant_id === p.id); return `<label class="score-row"><span><strong>${p.id} — ${p.name}</strong><small>${p.major || ''}</small></span><input required min="0" type="number" step="0.01" data-id="${p.id}" value="${old?.points ?? ''}"></label>`; }).join('');
};
if ($('#loginBtn')) $('#loginBtn').onclick = () => { if (!$('#email').value.trim() || !$('#password').value.trim()) return status('Enter any dummy email and password to continue.'); window.open('score.html', '_blank'); };
if ($('#signout')) $('#signout').onclick = async () => { if (db && !DEMO) await db.auth.signOut(); location.href = './'; };
const saveScores = async () => {
  if (DEMO) {
    const saved = Object.fromEntries([...document.querySelectorAll('[data-id]')].map(i => [i.dataset.id, { points: Number(i.value), comment: document.querySelector(`[data-comment="${i.dataset.id}"]`).value }]));
    localStorage.demoScores = JSON.stringify(saved);
    status('Scores submitted successfully. Redirecting to login…');
    location.href = './';
    return;
  }
};
if ($('#submit')) $('#submit').onclick = () => { $('#confirmModal').hidden = false; };
if ($('#cancelConfirm')) $('#cancelConfirm').onclick = () => { $('#confirmModal').hidden = true; };
if ($('#confirmSubmit')) $('#confirmSubmit').onclick = () => { $('#confirmModal').hidden = true; saveScores(); };
if ($('#scoring')) load().catch(error => { status(error.message); $('#scores').innerHTML = '<p class="error">Participant list could not be loaded. Restart the preview server and open /judge/score.html.</p>'; });
