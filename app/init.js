// Runs last: apply the saved language, else the browser language if we support it.
{
  let l; try { l = localStorage.lang; } catch {}
  l ||= LANGS.find(x => navigator.language.startsWith(x)) || 'en';
  if (l !== 'en') setLang(l);
}
