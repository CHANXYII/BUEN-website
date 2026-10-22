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
