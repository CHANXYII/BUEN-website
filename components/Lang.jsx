'use client';
// Current language for the whole page. <T>English text</T> renders the translation; useLang() gives t() and setLang().
import { createContext, useContext, useEffect, useState } from 'react';
import { LANGS, key } from '@/i18n';

const Ctx = createContext({ lang: LANGS[0], setLang: () => {}, t: s => s });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(LANGS[0]);
  const setLang = code => {
    const l = LANGS.find(x => x.code === code) || LANGS[0];
    setLangState(l);
    try { localStorage.lang = l.code; } catch {}
  };
  // First visit: the saved language, else the browser language if we support it. The HTML is built in English.
  useEffect(() => {
    let saved; try { saved = localStorage.lang; } catch {}
    const l = LANGS.find(x => x.code === saved) || LANGS.find(x => navigator.language.startsWith(x.code));
    if (l) setLangState(l);
  }, []);
  useEffect(() => { document.documentElement.lang = lang.html; }, [lang]);
  const t = s => (s && lang.dict[key(s)]) ?? s;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

// Usable from server components too: <T>Read more</T>
export function T({ children }) {
  return useLang().t(children);
}
