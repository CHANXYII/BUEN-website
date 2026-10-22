reveal('#about');
// Count-up for the stats, started when they scroll into view.
$$('[data-count]').forEach(el => {
  const to = +el.dataset.count;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return void (el.textContent = to + '+');
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect();
    const t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(to * p) + (p === 1 ? '+' : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }).observe(el);
});
