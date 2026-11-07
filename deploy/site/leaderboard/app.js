(() => {
// Shared helpers. Concatenated first, so section files can use them.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const io = 'IntersectionObserver' in window && new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12 });
// Fade a section in when scrolled into view; its cards pop in one after another.
const reveal = sel => {
  const el = $(sel);
  if (!el) return;
  $$('.values li,.person,.event,.list li', el).forEach((c, i) => { c.classList.add('item'); c.style.setProperty('--i', i); });
  io ? io.observe(el) : el.classList.add('in');
};

// Languages: en (the HTML itself), th, zh. Dictionaries map the English text to its translation.
// Any text not in a dictionary stays English. Add a string: add the same key to i18n/th.js and i18n/zh.js.
const DICT = {};
const LANGS = ['en', 'th', 'zh', 'ja', 'ko', 'fr', 'es', 'id', 'fil', 'vi', 'my', 'lo'];
const SHORT = { en: 'EN', th: 'ไทย', zh: '中文', ja: '日本語', ko: '한국어', fr: 'FR', es: 'ES', id: 'ID', fil: 'FIL', vi: 'VI', my: 'မြန်မာ', lo: 'ລາວ' };
const HTML_LANG = { en: 'en', th: 'th', zh: 'zh-Hans', ja: 'ja', ko: 'ko', fr: 'fr', es: 'es', id: 'id', fil: 'fil', vi: 'vi', my: 'my', lo: 'lo' };
const leaves = () => $$('body *').filter(e => !e.children.length && e.tagName !== 'SCRIPT' && (e.dataset.en || e.textContent.trim() in DICT.th));
let curLang = 'en';
const setLang = lang => {
  if (!LANGS.includes(lang)) lang = 'en';
  curLang = lang;
  leaves().forEach(e => {
    const en = e.dataset.en ||= e.textContent.trim();
    e.textContent = lang === 'en' ? en : DICT[lang][en] ?? en;
  });
  document.documentElement.lang = HTML_LANG[lang];
  document.title = lang === 'en' ? DICT.title : DICT[lang].title;
  $$('[data-lang]').forEach(b => { const on = b.dataset.lang === lang; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
  $('.lang-cur').textContent = SHORT[lang];
  try { localStorage.lang = lang; } catch {}
};
DICT.title = document.title;

DICT.th = {
  "Leaderboard": "ตารางอันดับ",
  "Competition": "การแข่งขัน",
  "Main site": "เว็บไซต์หลัก",
  "School of Engineering": "คณะวิศวกรรมศาสตร์",
  "Bangkok University": "มหาวิทยาลัยกรุงเทพ",
  "Rank": "อันดับ",
  "ID": "รหัส",
  "Participant": "ผู้เข้าร่วม",
  "Total": "รวม",
  "Updated": "อัปเดตล่าสุด",
  "Loading…": "กำลังโหลด…",
  "No results yet.": "ยังไม่มีผลคะแนน",
  "Could not load results.": "โหลดผลคะแนนไม่สำเร็จ",
  "Eliminated": "ตกรอบ",
  "title": "ตารางอันดับ | คณะวิศวกรรมศาสตร์ มหาวิทยาลัยกรุงเทพ"
};

DICT.zh = {
  "Leaderboard": "排行榜",
  "Competition": "比赛",
  "Main site": "主站",
  "School of Engineering": "工程学院",
  "Bangkok University": "曼谷大学",
  "Rank": "排名",
  "ID": "编号",
  "Participant": "参赛者",
  "Total": "总分",
  "Updated": "更新于",
  "Loading…": "加载中…",
  "No results yet.": "暂无结果。",
  "Could not load results.": "无法加载结果。",
  "Eliminated": "已淘汰",
  "title": "排行榜 | 曼谷大学工程学院"
};

DICT.ja = {
  "Leaderboard": "リーダーボード",
  "Competition": "コンペティション",
  "Main site": "メインサイト",
  "School of Engineering": "工学部",
  "Bangkok University": "バンコク大学",
  "Rank": "順位",
  "ID": "ID",
  "Participant": "参加者",
  "Total": "合計",
  "Updated": "更新日",
  "Loading…": "読み込み中…",
  "No results yet.": "まだ結果がありません。",
  "Could not load results.": "結果を読み込めませんでした。",
  "Eliminated": "敗退",
  "title": "リーダーボード | バンコク大学 工学部"
};

DICT.ko = {
  "Leaderboard": "리더보드",
  "Competition": "대회",
  "Main site": "메인 사이트",
  "School of Engineering": "공과대학",
  "Bangkok University": "방콕대학교",
  "Rank": "순위",
  "ID": "ID",
  "Participant": "참가자",
  "Total": "합계",
  "Updated": "업데이트",
  "Loading…": "불러오는 중…",
  "No results yet.": "아직 결과가 없습니다.",
  "Could not load results.": "결과를 불러올 수 없습니다.",
  "Eliminated": "탈락",
  "title": "리더보드 | 방콕대학교 공과대학"
};

DICT.fr = {
  "Leaderboard": "Classement",
  "Competition": "Compétition",
  "Main site": "Site principal",
  "School of Engineering": "École d’ingénierie",
  "Bangkok University": "Université de Bangkok",
  "Rank": "Rang",
  "ID": "ID",
  "Participant": "Participant",
  "Total": "Total",
  "Updated": "Mis à jour",
  "Loading…": "Chargement…",
  "No results yet.": "Aucun résultat pour l’instant.",
  "Could not load results.": "Impossible de charger les résultats.",
  "Eliminated": "Éliminés",
  "title": "Classement | École d’ingénierie, Université de Bangkok"
};

DICT.es = {
  "Leaderboard": "Clasificación",
  "Competition": "Competencia",
  "Main site": "Sitio principal",
  "School of Engineering": "Escuela de Ingeniería",
  "Bangkok University": "Universidad de Bangkok",
  "Rank": "Puesto",
  "ID": "ID",
  "Participant": "Participante",
  "Total": "Total",
  "Updated": "Actualizado",
  "Loading…": "Cargando…",
  "No results yet.": "Aún no hay resultados.",
  "Could not load results.": "No se pudieron cargar los resultados.",
  "Eliminated": "Eliminados",
  "title": "Clasificación | Escuela de Ingeniería, Universidad de Bangkok"
};

DICT.id = {
  "Leaderboard": "Papan Peringkat",
  "Competition": "Kompetisi",
  "Main site": "Situs utama",
  "School of Engineering": "Fakultas Teknik",
  "Bangkok University": "Universitas Bangkok",
  "Rank": "Peringkat",
  "ID": "ID",
  "Participant": "Peserta",
  "Total": "Total",
  "Updated": "Diperbarui",
  "Loading…": "Memuat…",
  "No results yet.": "Belum ada hasil.",
  "Could not load results.": "Gagal memuat hasil.",
  "Eliminated": "Tereliminasi",
  "title": "Papan Peringkat | Fakultas Teknik, Universitas Bangkok"
};

DICT.fil = {
  "Leaderboard": "Leaderboard",
  "Competition": "Kompetisyon",
  "Main site": "Pangunahing site",
  "School of Engineering": "School of Engineering",
  "Bangkok University": "Bangkok University",
  "Rank": "Ranggo",
  "ID": "ID",
  "Participant": "Kalahok",
  "Total": "Kabuuan",
  "Updated": "Na-update",
  "Loading…": "Naglo-load…",
  "No results yet.": "Wala pang resulta.",
  "Could not load results.": "Hindi ma-load ang mga resulta.",
  "Eliminated": "Na-eliminate",
  "title": "Leaderboard | School of Engineering, Bangkok University"
};

DICT.vi = {
  "Leaderboard": "Bảng xếp hạng",
  "Competition": "Cuộc thi",
  "Main site": "Trang chính",
  "School of Engineering": "Trường Kỹ thuật",
  "Bangkok University": "Đại học Bangkok",
  "Rank": "Hạng",
  "ID": "Mã",
  "Participant": "Thí sinh",
  "Total": "Tổng",
  "Updated": "Cập nhật",
  "Loading…": "Đang tải…",
  "No results yet.": "Chưa có kết quả.",
  "Could not load results.": "Không thể tải kết quả.",
  "Eliminated": "Bị loại",
  "title": "Bảng xếp hạng | Trường Kỹ thuật, Đại học Bangkok"
};

DICT.my = {
  "Leaderboard": "အဆင့်သတ်မှတ်ဇယား",
  "Competition": "ပြိုင်ပွဲ",
  "Main site": "ပင်မဝဘ်ဆိုက်",
  "School of Engineering": "အင်ဂျင်နီယာကျောင်း",
  "Bangkok University": "ဘန်ကောက်တက္ကသိုလ်",
  "Rank": "အဆင့်",
  "ID": "ID",
  "Participant": "ပါဝင်သူ",
  "Total": "စုစုပေါင်း",
  "Updated": "ပြင်ဆင်ချိန်",
  "Loading…": "ဖွင့်နေသည်…",
  "No results yet.": "ရလဒ်မရှိသေးပါ။",
  "Could not load results.": "ရလဒ်များကို မဖွင့်နိုင်ပါ။",
  "Eliminated": "ထွက်ရသူများ",
  "title": "အဆင့်သတ်မှတ်ဇယား | အင်ဂျင်နီယာကျောင်း၊ ဘန်ကောက်တက္ကသိုလ်"
};

DICT.lo = {
  "Leaderboard": "ຕາຕະລາງອັນດັບ",
  "Competition": "ການແຂ່ງຂັນ",
  "Main site": "ເວັບໄຊຫຼັກ",
  "School of Engineering": "ຄະນະວິສະວະກຳສາດ",
  "Bangkok University": "ມະຫາວິທະຍາໄລບາງກອກ",
  "Rank": "ອັນດັບ",
  "ID": "ລະຫັດ",
  "Participant": "ຜູ້ເຂົ້າຮ່ວມ",
  "Total": "ລວມ",
  "Updated": "ອັບເດດ",
  "Loading…": "ກຳລັງໂຫຼດ…",
  "No results yet.": "ຍັງບໍ່ມີຜົນ.",
  "Could not load results.": "ບໍ່ສາມາດໂຫຼດຜົນໄດ້.",
  "Eliminated": "ຕົກຮອບ",
  "title": "ຕາຕະລາງອັນດັບ | ຄະນະວິສະວະກຳສາດ, ມະຫາວິທະຍາໄລບາງກອກ"
};

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

// Runs last: apply the saved language, else the browser language if we support it.
{
  let l; try { l = localStorage.lang; } catch {}
  l ||= LANGS.find(x => navigator.language.startsWith(x)) || 'en';
  if (l !== 'en') setLang(l);
}

})();
