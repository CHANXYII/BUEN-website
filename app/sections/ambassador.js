['#amb-break', '#amb-what', '#amb-advisor', '#amb-presidents', '#amb-generations', '#amb-work', '#amb-video'].forEach(reveal);

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
  if (slides.length < 2) $$('.prev,.next,.dots', box).forEach(e => e.hidden = true); // one president: nothing to slide
  go(0); play();
}

// "What you'll do" roles: endless loop. Wraps the row in a clipping box and appends a hidden
// copy of the cards so the CSS animation (slide left by one set) repeats without a jump. Speed: ~4s per name.
{
  const track = $('.roles-track'), cards = $$('.role', track);
  const loop = document.createElement('div');
  loop.className = 'roles-loop';
  track.before(loop);
  loop.append(track);
  if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
    cards.forEach(c => { const d = c.cloneNode(true); d.setAttribute('aria-hidden', 'true'); track.append(d); });
    track.style.setProperty('--dur', cards.length * 4 + 's');
  }
}

// Generation tabs above the profiles: one generation shows at a time, first tab first. They also switch the
// work gallery below, which has no tabs of its own.
{
  const tabs = $$('#ambassador .tabs button'), panels = $$('#ambassador .gen-panel');
  const show = g => {
    tabs.forEach(b => { const on = b.dataset.gen === g; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    panels.forEach(p => p.hidden = p.dataset.gen !== g);
  };
  tabs.forEach(b => b.addEventListener('click', () => show(b.dataset.gen)));
  if (tabs.length) show(tabs[0].dataset.gen);
}

// Videos: the IDs in .vids data-yt play as a looping playlist. Starts muted 2s after scrolling into view
// (browsers block autoplay with sound), or with sound on click; arrows and video end jump to the next one
// and play it right away. No IDs = placeholder.
{
  const box = $('.vids'), v = $('.video', box), ids = box.dataset.yt.split(' ').filter(Boolean);
  let i = 0, t, muted = true;
  const show = n => {
    $('iframe', box)?.remove(); // switching stops the playing video
    v.hidden = false;
    i = (n + ids.length) % ids.length || 0;
    const yt = v.dataset.yt = encodeURIComponent(ids[i] || '');
    // YouTube cover: maxres when the video has one, hq underneath as fallback.
    v.style.background = yt ? `center/cover url(https://i.ytimg.com/vi/${yt}/maxresdefault.jpg), center/cover url(https://i.ytimg.com/vi/${yt}/hqdefault.jpg)` : '';
  };
  const play = () => {
    if (!v.dataset.yt || v.hidden) return;
    v.hidden = true;
    // enablejsapi: the player posts its state to us, so we know when the video ends.
    v.insertAdjacentHTML('afterend', `<iframe class="video" src="https://www.youtube-nocookie.com/embed/${v.dataset.yt}?autoplay=1&playsinline=1&enablejsapi=1${muted ? '&mute=1' : ''}" title="BUEN video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`);
    const f = v.nextElementSibling;
    f.onload = () => f.contentWindow.postMessage('{"event":"listening"}', '*');
  };
  const go = n => { show(n); play(); };
  addEventListener('message', e => {
    if (e.origin !== 'https://www.youtube-nocookie.com' || e.source !== $('iframe', box)?.contentWindow) return;
    let d; try { d = JSON.parse(e.data); } catch { return; }
    if ((d.event === 'onStateChange' ? d.info : d.info?.playerState) === 0) go(i + 1); // 0 = ended
  });
  v.addEventListener('click', () => { muted = false; play(); });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion:reduce)').matches)
    new IntersectionObserver(([e], o) => {
      clearTimeout(t); // scrolled away before 2s: wait again next time
      if (e.isIntersecting) t = setTimeout(() => { o.disconnect(); play(); }, 2000);
    }, { threshold: 0.6 }).observe(box);
  $('.prev', box).addEventListener('click', () => go(i - 1));
  $('.next', box).addEventListener('click', () => go(i + 1));
  if (ids.length < 2) $$('.prev,.next', box).forEach(b => b.hidden = true);
  show(0);
}
