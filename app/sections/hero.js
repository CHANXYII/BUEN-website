// Orbs drift slightly with the pointer (desktop only).
if (matchMedia('(hover:hover)').matches) {
  const orbs = $$('.hero .orb');
  $('.hero').addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    orbs.forEach((o, i) => o.style.translate = `${x * (i ? -50 : 40)}px ${y * (i ? -50 : 40)}px`);
  });
}
