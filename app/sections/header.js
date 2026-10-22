// Mobile menu.
{
  const btn = $('.menu-btn'), nav = $('#nav');
  const open = o => { nav.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); };
  btn.addEventListener('click', () => open(!nav.classList.contains('open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) open(false); });
}
// Language dropdown (top-right). Logic in app/i18n.js.
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
// Scroll effects: shrinking header, progress bar, active nav link, back-to-top button.
{
  const hd = $('#header'), bar = $('.progress'), top = $('.to-top');
  const links = $$('#nav a:not(.nav-cta)'), secs = links.map(a => $(a.getAttribute('href')));
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    hd.classList.toggle('scrolled', scrollY > 20);
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    top.classList.toggle('show', scrollY > 600);
    let cur = -1;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= 140) cur = i; });
    links.forEach((a, i) => a.classList.toggle('active', i === cur));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
