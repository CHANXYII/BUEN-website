// Leaderboard page. Total = sum of workshop points; ranks are unique (1, 2, 3, ...). Uses $, $$ (lib.js) and setLang (i18n.js).
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Language dropdown (top-right).
{
  const box = $('.lang'), btn = $('.lang-btn'), list = $('#lang-list');
  const show = o => { list.hidden = !o; btn.setAttribute('aria-expanded', o); };
  btn.addEventListener('click', () => show(list.hidden));
  list.addEventListener('click', e => {
    const b = e.target.closest('[data-lang]');
    if (b) { setLang(b.dataset.lang); show(false); btn.focus(); }
  });
  document.addEventListener('click', e => { if (!box.contains(e.target)) show(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') show(false); });
}

// Background: embers rising from the bottom (the glow is CSS). Off for reduced motion.
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const cv = $('#fx'), g = cv.getContext('2d');
  const COLORS = ['179,18,46', '212,175,55', '255,120,40'];
  let w, h, dots = [];
  const fit = () => { w = cv.width = innerWidth; h = cv.height = innerHeight; dots = Array.from({ length: Math.min(90, w / 14 | 0) }, () => spawn(true)); };
  const spawn = scatter => ({ x: Math.random() * w, y: scatter ? Math.random() * h : h + 10, r: .6 + Math.random() * 2.2, v: .25 + Math.random() * .9, ph: Math.random() * 6.3, c: COLORS[Math.random() * 3 | 0] });
  const tick = t => {
    g.clearRect(0, 0, w, h);
    g.globalCompositeOperation = 'lighter';
    dots.forEach((d, i) => {
      d.y -= d.v;
      d.x += Math.sin(t / 900 + d.ph) * .4;
      const a = Math.min(1, d.y / h * 1.6) * (.5 + .5 * Math.sin(t / 300 + d.ph));
      if (d.y < -10) return dots[i] = spawn();
      const gr = g.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 5);
      gr.addColorStop(0, `rgba(${d.c},${a})`);
      gr.addColorStop(1, `rgba(${d.c},0)`);
      g.fillStyle = gr;
      g.fillRect(d.x - d.r * 5, d.y - d.r * 5, d.r * 10, d.r * 10);
    });
    requestAnimationFrame(tick);
  };
  fit();
  addEventListener('resize', fit);
  requestAnimationFrame(tick);
}

fetch('/api/leaderboard').then(r => r.json()).then(d => {
  $('#lb-kicker').textContent = d.kicker;
  $('#lb-title').textContent = d.title;
  $('#lb-date').textContent = d.updated || '';
  $('#lb-updated').hidden = !d.updated;
  const ws = d.workshops || [];
  $('#lb-head').innerHTML = `<tr><th>Rank</th><th></th><th>Participant</th>${ws.map(w => `<th class="num">${esc(w.name)}</th>`).join('')}<th class="num">Total</th></tr>`;
  const rows = d.participants.map(p => ({ ...p, total: ws.reduce((n, w) => n + (+p.points?.[w.id] || 0), 0) }))
    .sort((a, b) => b.total - a.total || [...ws].reverse().reduce((r, w) => r || (+b.points?.[w.id] || 0) - (+a.points?.[w.id] || 0), 0) || a.id.localeCompare(b.id)); // tiebreak: latest workshop first, then ID
  // fast-track = exactly one per workshop: highest points; a tie goes to the better overall rank (rows are already sorted). 0 points never wins.
  const win = Object.fromEntries(ws.map(w => {
    const top = rows.reduce((a, p) => (+p.points?.[w.id] || 0) > (+a?.points?.[w.id] || 0) ? p : a, null);
    return [w.id, +top?.points?.[w.id] > 0 ? top.id : null];
  }));
  const BOLT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>';
  const CUT = 16; // top 16 are finalists; rank 17 and below is eliminated
  let prev = 0;
  $('#lb-rows').innerHTML = rows.map((p, i) => {
    const rank = i + 1;
    const cls = rank <= 3 ? `top top${rank}` : rank > CUT ? 'out' : '';
    const line = rank > CUT && prev <= CUT ? `<tr class="cut"><td colspan="${ws.length + 4}"><span>Eliminated</span></td></tr>` : '';
    prev = rank;
    const cell = w => `<td class="num">${esc(p.points?.[w.id] ?? '–')}</td>`;
    const ft = ws.map((w, k) => win[w.id] === p.id ? `<span class="ft" title="${esc(w.name)}: fast-track" aria-label="Fast-track ${k + 1}">${BOLT}${k + 1}</span>` : '').join('');
    const pic = p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy">` : `<span class="av" aria-hidden="true">${esc(p.id.replace(/\D/g, ''))}</span>`;
    const who = `<div class="who"><span class="id">${esc(p.id)}</span><strong translate="no">${esc(p.name)}</strong>${ft}${p.major ? `<small>${esc(p.major)}</small>` : ''}</div>`;
    return `${line}<tr class="${cls}" style="--i:${i}"><td>${rank}</td><td class="pic">${pic}</td><td>${who}</td>${ws.map(cell).join('')}<td class="num">${p.total}</td></tr>`;
  }).join('') || `<tr><td colspan="${ws.length + 4}">No results yet.</td></tr>`;
}).catch(() => { $('#lb-rows').innerHTML = '<tr><td colspan="9">Could not load results.</td></tr>'; })
  .finally(() => { if (curLang !== 'en') setLang(curLang); }); // translate the rendered table
