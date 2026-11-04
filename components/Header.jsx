'use client';
// Sticky header: mobile menu, language dropdown, and scroll effects (shrinking header, progress bar, active link,
// back-to-top button). Links and texts: content/site.js. Languages: i18n/index.js.
import { useEffect, useRef, useState } from 'react';
import { nav, site } from '@/content/site';
import { LANGS } from '@/i18n';
import { asset } from '@/lib/asset';
import { T, useLang } from './Lang';
import { Icon } from './ui';

export default function Header() {
  const { lang, setLang } = useLang();
  const [menu, setMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [active, setActive] = useState(-1);
  const langBox = useRef(null), langBtn = useRef(null), bar = useRef(null);

  useEffect(() => {
    const secs = nav.map(l => document.querySelector(l.href));
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      setScrolled(scrollY > 20);
      setShowTop(scrollY > 600);
      let cur = -1;
      secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= 140) cur = i; });
      setActive(cur);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  // The dropdown closes on a click outside it or on Esc.
  useEffect(() => {
    const click = e => { if (!langBox.current.contains(e.target)) setLangOpen(false); };
    const esc = e => { if (e.key === 'Escape') setLangOpen(false); };
    document.addEventListener('click', click);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('click', click); document.removeEventListener('keydown', esc); };
  }, []);

  const pick = code => { setLang(code); setLangOpen(false); langBtn.current.focus(); };

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="header">
        <div className="bar">
          <a className="brand" href="#top" aria-label={site.name}>
            <span className="logo"><img src={asset('/assets/BUEN-Logo-header.png')} alt="" width="380" height="99" /></span>
          </a>
          <nav id="nav" aria-label="Main" className={menu ? 'open' : ''} onClick={e => e.target.closest('a') && setMenu(false)}>
            {nav.map((l, i) => <a key={l.href} href={l.href} className={i === active ? 'active' : ''}><T>{l.label}</T></a>)}
            <a className="nav-cta" href={site.applyUrl} target="_blank" rel="noopener"><T>Apply now</T></a>
          </nav>
          <div className="lang" ref={langBox}>
            <button ref={langBtn} className="lang-btn" aria-haspopup="true" aria-expanded={langOpen} aria-controls="lang-list" aria-label="Language" onClick={() => setLangOpen(!langOpen)}>
              <Icon name="globe" />
              <span className="lang-cur">{lang.short}</span><span className="caret" aria-hidden="true">&#9662;</span>
            </button>
            <ul className="lang-list" id="lang-list" role="menu" hidden={!langOpen}>
              <li className="lang-title" role="presentation">Language / ภาษา / 语言 / 言語 / 언어 / Langue</li>
              {LANGS.map(l => (
                <li role="none" key={l.code}>
                  <button role="menuitemradio" data-lang={l.code} className={l === lang ? 'on' : ''} aria-checked={l === lang} onClick={() => pick(l.code)}>{l.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <button className="menu-btn" aria-expanded={menu} aria-controls="nav" onClick={() => setMenu(!menu)}><T>Menu</T></button>
        </div>
        <div className="progress" ref={bar}></div>
      </header>
      <a className={`to-top${showTop ? ' show' : ''}`} href="#top" aria-label="Back to top">&uarr;</a>
    </>
  );
}
