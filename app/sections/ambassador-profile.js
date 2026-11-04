// Profiles: hovering a photo shows "Show more"; clicking (or Enter) opens the profile banner filled from that card.
// Each profile has its own link: the first name, e.g. site/joannes. Back/forward and opening the link directly work too.
{
  const dlg = $('.profile'), img = $('img', dlg), cards = {};
  // Sets the English text and drops the old translation memory, so setLang translates the new text.
  const put = (el, en) => { delete el.dataset.en; el.textContent = en; };
  const open = card => {
    const src = $('img', card), major = $('p:not(.position)', card), g = +card.closest('.gen-panel').dataset.gen;
    img.src = src.src; img.alt = src.alt;
    put($('h4', dlg), $('h4', card).textContent.trim());
    put($('.meta', dlg), major.dataset.en || key(major.textContent.trim()));
    // Generation first, then the card's other positions (fresh <li>s, so setLang translates them).
    const roles = [`BUEN Ambassador: The ${g}${['st', 'nd', 'rd'][g - 1] || 'th'} Generation`, // ponytail: ordinal right up to 20
      ...$$('.position', card).map(p => p.dataset.en || key(p.textContent.trim()))];
    $('.roles', dlg).replaceChildren(...roles.map(t => Object.assign(document.createElement('li'), { textContent: t })));
    $('.gallery', dlg).replaceChildren(...$$(`#amb-work .gallery[data-gen="${g}"] > *`).map(n => n.cloneNode(true)));
    setLang(curLang);
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  };
  // The card whose link is the current URL (last path part), if any.
  const here = () => cards[decodeURIComponent(location.pathname.split('/').pop()).toLowerCase()];
  let pushed = false; // true when we added the history entry, so closing can just go back
  $$('#amb-generations .person').forEach(card => {
    const slug = $('h4', card).textContent.trim().split(/\s+/)[0].toLowerCase();
    cards[slug] = card;
    $('.avatar', card).insertAdjacentHTML('beforeend', '<span class="more">Show more</span>');
    const go = () => { open(card); history.pushState(null, '', slug); pushed = true; };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  });
  // Back button or Esc: close and leave the profile link (browser back/forward is handled by popstate).
  const leave = () => {
    if (here()) pushed ? history.back() : history.replaceState(null, '', './');
    pushed = false;
  };
  dlg.addEventListener('cancel', leave); // Esc; the dialog then closes itself
  $('.back', dlg).addEventListener('click', () => { dlg.close(); leave(); });
  addEventListener('popstate', () => { const c = here(); c ? open(c) : dlg.open && dlg.close(); });
  if (here()) open(here());
}
