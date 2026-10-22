// Runs last: apply the saved language, else the browser language.
{
  let l; try { l = localStorage.lang; } catch {}
  l ||= navigator.language.startsWith('th') ? 'th' : navigator.language.startsWith('zh') ? 'zh' : 'en';
  if (l !== 'en') setLang(l);
}
