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
  $$('.person,.shot,.list li', el).forEach((c, i) => { c.classList.add('item'); c.style.setProperty('--i', i); });
  io ? io.observe(el) : el.classList.add('in');
};
// Tabs in a section: each button shows the panels with the same data-gen, first tab first.
const tabs = (root, btnSel = '.tabs button', panelSel = '.gen-panel') => {
  const btns = $$(`${root} ${btnSel}`), panels = $$(`${root} ${panelSel}`);
  const show = g => {
    btns.forEach(b => { const on = b.dataset.gen === g; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    panels.forEach(p => p.hidden = p.dataset.gen !== g);
  };
  btns.forEach(b => b.addEventListener('click', () => show(b.dataset.gen)));
  if (btns.length) show(btns[0].dataset.gen);
};
