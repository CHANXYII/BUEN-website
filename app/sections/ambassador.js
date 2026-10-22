['#amb-what', '#amb-presidents', '#amb-generations', '#amb-events', '#amb-video'].forEach(reveal);

// Presidents slideshow: loops, autoplays, pauses on hover/focus, buttons + dots + swipe.
{
  const box = $('.slider'), track = $('.track'), slides = $$('.slide', box), dots = $$('.dots button', box);
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let i = 0, timer, x0;
  const go = n => {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(${-i * 100}%)`;
    slides.forEach((s, k) => s.inert = k !== i);
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i));
  };
  const stop = () => clearInterval(timer);
  const play = () => { stop(); if (!still) timer = setInterval(() => go(i + 1), 5000); };
  $('.prev', box).addEventListener('click', () => { go(i - 1); play(); });
  $('.next', box).addEventListener('click', () => { go(i + 1); play(); });
  dots.forEach((d, k) => d.addEventListener('click', () => { go(k); play(); }));
  box.addEventListener('pointerenter', stop);
  box.addEventListener('pointerleave', play);
  box.addEventListener('focusin', stop);
  box.addEventListener('focusout', play);
  box.addEventListener('pointerdown', e => x0 = e.clientX);
  box.addEventListener('pointerup', e => { if (x0 != null && Math.abs(e.clientX - x0) > 50) go(i + (e.clientX < x0 ? 1 : -1)); x0 = null; });
  go(0); play();
}

// Generation tabs: show one generation at a time (newest first).
{
  const tabs = $$('.tabs button'), panels = $$('.gen-panel');
  const show = g => {
    tabs.forEach(b => { const on = b.dataset.gen === g; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    panels.forEach(p => p.hidden = p.dataset.gen !== g);
  };
  tabs.forEach(b => b.addEventListener('click', () => show(b.dataset.gen)));
  show(tabs[0].dataset.gen);
}

// Promo video: loads the YouTube player only on click (no ID yet = placeholder).
{
  const v = $('.video');
  v.addEventListener('click', () => {
    if (!v.dataset.yt) return;
    v.outerHTML = `<iframe class="video" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.dataset.yt)}?autoplay=1" title="BUEN Ambassador promo" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  });
}
