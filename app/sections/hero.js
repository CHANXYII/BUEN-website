// Featured news slideshow. The active progress segment drives it: when its animation ends, go to the next slide.
{
  const hero = $('.hero'), box = $('.segs'), slides = $$('.hslide'), segs = $$('.seg');
  let i = 0;
  const go = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('on', k === i); s.inert = k !== i; });
    segs.forEach(g => g.classList.remove('on'));
    void box.offsetWidth; // restart the progress animation
    segs[i].classList.add('on');
  };
  segs.forEach((g, k) => g.addEventListener('click', () => go(k)));
  box.addEventListener('animationend', () => go(i + 1));
  go(0);

  // Official video pop-up (YouTube ID lives in data-yt on the slide; empty = placeholder).
  const dlg = $('.vmodal'), body = $('.vbody');
  const close = () => { dlg.close(); body.innerHTML = ''; hero.classList.remove('paused'); };
  $$('.watch').forEach(b => b.addEventListener('click', () => {
    const id = b.closest('.hslide').dataset.yt;
    body.innerHTML = id
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1" title="BU official video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : '<p class="soon">Video coming soon</p>';
    setLang(curLang); // translate the placeholder text
    hero.classList.add('paused');
    dlg.showModal();
  }));
  $('.vclose').addEventListener('click', close);
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => { body.innerHTML = ''; hero.classList.remove('paused'); });
}
