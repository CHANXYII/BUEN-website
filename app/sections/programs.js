reveal('#programs');
// Filter program cards by level.
$$('.filters button').forEach(b => b.addEventListener('click', () => {
  $$('.filters button').forEach(x => x.classList.toggle('on', x === b));
  $$('.card').forEach(c => c.hidden = b.dataset.level !== 'all' && c.dataset.level !== b.dataset.level);
}));
