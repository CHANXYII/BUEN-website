reveal('#com-what');
// One panel per academic year, newest first. Switching year keeps the group tab that was open.
tabs('#committee', '.year-tabs button', '.year-panel');
let group;
$$('.year-panel').forEach(p => {
  ['.com-president', '.com-members', '.com-work'].forEach(s => reveal(`#${p.id} ${s}`));
  tabs(`#${p.id}`);
  $$('.tabs button', p).forEach(b => b.addEventListener('click', () => group = b.dataset.gen));
});
$$('.year-tabs button').forEach(b => b.addEventListener('click', () => $(`#year-${b.dataset.gen} .tabs button[data-gen="${group}"]`)?.click()));
