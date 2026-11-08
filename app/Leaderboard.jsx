'use client';
// Leaderboard UI: EN/TH language toggle, ember background, table. Rows arrive ranked from page.jsx.
import { useEffect, useRef, useState } from 'react';
import { translations } from './i18n/translations';
const CUT = 16; // top 16 are finalists; rank 17 and below is eliminated
const MAIN = 'https://www.bu.ac.th/th/engineering';
const PARTICIPANT_KEY = 'buen-participant-id';
const ENTERED_KEY = 'buen-leaderboard-entered';
const LANGUAGE_KEY = 'buen_lang';
const LANGUAGES = [
  ['en', 'English'],
  ['th', 'ไทย'],
  ['zh', '中文 (简体)'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['fr', 'Français'],
  ['es', 'Español'],
  ['id', 'Bahasa Indonesia'],
  ['fil', 'Filipino'],
  ['vi', 'Tiếng Việt'],
  ['my', 'မြန်မာ'],
  ['lo', 'ລາວ'],
];

function ParticipantAvatar({ participant, lazy }) {
  const [failed, setFailed] = useState(false);
  if (!participant.photo || failed) return <span className="av" aria-hidden="true">{participant.id}</span>;
  return <img src={participant.photo} alt="" loading={lazy ? 'lazy' : undefined} onError={() => setFailed(true)} />;
}

export default function Leaderboard({ kicker, title, updated, countdown, workshops: ws, rows, win }) {
  const [lang, setLang] = useState('en');
  const [languageReady, setLanguageReady] = useState(false);
  const [languageError, setLanguageError] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [participant, setParticipant] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [loginError, setLoginError] = useState('');
  const cv = useRef();
  const t = key => translations[lang][key] ?? key;
  const translateValue = value => value === title
    ? t('pageTitle')
    : value === kicker
      ? t('category')
    : value === 'Final round'
      ? t('finalRound')
      : translations[lang].workshopNames[value] ?? translations[lang].majorNames[value] ?? value;

  useEffect(() => {
    try {
      const savedId = localStorage.getItem(PARTICIPANT_KEY);
      const index = rows.findIndex(p => p.id.toUpperCase() === savedId?.toUpperCase());
      if (index !== -1) {
        setParticipant({ person: rows[index], rank: index + 1 });
        setParticipantId(rows[index].id);
        setHasEntered(localStorage.getItem(ENTERED_KEY) === 'true');
      }
    } catch {
      setLoginError('readStatusError');
    } finally {
      setAuthReady(true);
    }
  }, [rows]);

  const submitParticipantId = e => {
    e.preventDefault();
    const normalizedId = participantId.trim().toUpperCase();
    const index = rows.findIndex(p => p.id.toUpperCase() === normalizedId);
    if (index === -1) {
      setLoginError('notFound');
      return;
    }
    const currentParticipant = { person: rows[index], rank: index + 1 };
    setParticipant(currentParticipant);
    setParticipantId(rows[index].id);
    setLoginError('');
    setHasEntered(false);
    try {
      localStorage.setItem(PARTICIPANT_KEY, rows[index].id);
      localStorage.removeItem(ENTERED_KEY);
    } catch {
      setLoginError('saveLoginError');
    }
  };

  const enterLeaderboard = () => {
    try {
      localStorage.setItem(ENTERED_KEY, 'true');
    } catch {
      setLoginError('saveEntryError');
    }
    setHasEntered(true);
    setLoginError('');
  };

  const logoutParticipant = () => {
    try {
      localStorage.removeItem(PARTICIPANT_KEY);
      localStorage.removeItem(ENTERED_KEY);
    } catch {
      setLoginError('removeLoginError');
    }
    setParticipant(null);
    setParticipantId('');
    setHasEntered(false);
  };

  useEffect(() => {
    let initialLanguage = 'en';
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      if (Object.hasOwn(translations, savedLanguage)) initialLanguage = savedLanguage;
      else initialLanguage = LANGUAGES.find(([locale]) => navigator.language.toLowerCase().startsWith(locale))?.[0] ?? 'en';
    } catch {
      initialLanguage = LANGUAGES.find(([locale]) => navigator.language.toLowerCase().startsWith(locale))?.[0] ?? 'en';
    }
    setLang(initialLanguage);
    setLanguageReady(true);
  }, []);
  useEffect(() => {
    if (!languageReady) return;
    document.documentElement.lang = lang;
    const updateTitle = () => {
      const localizedTitle = translations[lang].documentTitle;
      if (document.title !== localizedTitle) document.title = localizedTitle;
    };
    updateTitle();
    const observer = new MutationObserver(updateTitle);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [lang, languageReady]);

  const selectLanguage = selectedLanguage => {
    if (!Object.hasOwn(translations, selectedLanguage)) return;
    setLang(selectedLanguage);
    setLanguageError('');
    try {
      localStorage.setItem(LANGUAGE_KEY, selectedLanguage);
    } catch {
      setLanguageError('saveLanguageError');
    }
  };
  const languageControl = floating => (
    <div className={`language-control${floating ? ' floating' : ''}`} role="group" aria-label={t('switchLanguage')}>
      <label className="language-select-label" htmlFor={floating ? 'language-select-floating' : 'language-select-header'}>{t('switchLanguage')}</label>
      <select
        id={floating ? 'language-select-floating' : 'language-select-header'}
        value={lang}
        disabled={!languageReady}
        onChange={event => selectLanguage(event.target.value)}
      >
        {LANGUAGES.map(([locale, name]) => <option key={locale} value={locale}>{name}</option>)}
      </select>
      {languageError && <span className="language-error" role="alert">{t(languageError)}</span>}
    </div>
  );

  // Background: embers rising from the bottom (the glow is CSS). Off for reduced motion.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const c = cv.current, g = c.getContext('2d');
    const COLORS = ['179,18,46', '212,175,55', '255,120,40'];
    let w, h, dots = [], raf;
    const spawn = scatter => ({ x: Math.random() * w, y: scatter ? Math.random() * h : h + 10, r: .6 + Math.random() * 2.2, v: .25 + Math.random() * .9, ph: Math.random() * 6.3, c: COLORS[Math.random() * 3 | 0] });
    const fit = () => { w = c.width = innerWidth; h = c.height = innerHeight; dots = Array.from({ length: Math.min(90, w / 14 | 0) }, () => spawn(true)); };
    const tick = tm => {
      g.clearRect(0, 0, w, h);
      g.globalCompositeOperation = 'lighter';
      dots.forEach((d, i) => {
        d.y -= d.v;
        d.x += Math.sin(tm / 900 + d.ph) * .4;
        const a = Math.min(1, d.y / h * 1.6) * (.5 + .5 * Math.sin(tm / 300 + d.ph));
        if (d.y < -10) return dots[i] = spawn();
        const gr = g.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 5);
        gr.addColorStop(0, `rgba(${d.c},${a})`);
        gr.addColorStop(1, `rgba(${d.c},0)`);
        g.fillStyle = gr;
        g.fillRect(d.x - d.r * 5, d.y - d.r * 5, d.r * 10, d.r * 10);
      });
      raf = requestAnimationFrame(tick);
    };
    fit();
    addEventListener('resize', fit);
    raf = requestAnimationFrame(tick);
    return () => { removeEventListener('resize', fit); cancelAnimationFrame(raf); };
  }, []);

  const cols = ws.length + 4;
  const pic = (p, lazy = true) => <ParticipantAvatar participant={p} lazy={lazy} />;
  const badges = p => ws.map((w, k) => win[w.id] === p.id && (
    <span className="ft" key={w.id} title={`${translateValue(w.name)}: ${t('fastTrack')}`} aria-label={`${t('fastTrack')} ${k + 1}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg>{k + 1}
    </span>
  ));
  if (!authReady) {
    return (
      <>
        <div className="glow" aria-hidden="true" />
        <canvas id="fx" ref={cv} aria-hidden="true" />
        {languageControl(true)}
        <div className="participant-loading" role="status">{t('loadingParticipants')}</div>
      </>
    );
  }
  if (!hasEntered) {
    return (
      <>
        <div className="glow" aria-hidden="true" />
        <canvas id="fx" ref={cv} aria-hidden="true" />
        {languageControl(true)}
        {participant ? (
          <section className={`participant-card ${participant.rank <= CUT ? 'is-finalist' : 'is-eliminated'}`} role="dialog" aria-modal="true" aria-labelledby="participant-result-title">
            {participant.rank <= CUT && <p className="participant-confetti" aria-hidden="true">🎉</p>}
            <p className="participant-eyebrow">{participant.rank <= CUT ? t('finalistEyebrow') : t('participantResultEyebrow')}</p>
            <h1 id="participant-result-title">
              {participant.rank <= CUT
                ? t('congratulationsTitle')
                : t('eliminatedTitle')}
            </h1>
            <p className="participant-intro">{participant.rank <= CUT ? t('congratulationsMessage') : t('eliminatedMessage')}</p>
            <div className="participant-details">
              <p><span>{t('participantCode')}</span><strong>{participant.person.id}</strong></p>
              <p><span>{t('participantName')}</span><strong translate="no">{participant.person.name}</strong></p>
              <p className="participant-rank"><span>{t('currentRank')}</span><strong>{t('rank')} {participant.rank}</strong></p>
              <p><span>{t('score')}</span><strong>{participant.person.total}</strong></p>
            </div>
            {loginError && <p className="participant-error" role="alert">{t(loginError)}</p>}
            <button className="participant-action" type="button" onClick={enterLeaderboard}>{t('enterLeaderboard')}</button>
          </section>
        ) : (
          <section className="participant-login" aria-labelledby="participant-login-title">
            <p className="participant-eyebrow">{translateValue(kicker)}</p>
            <h1 id="participant-login-title">{t('loginTitle')}</h1>
            <p className="participant-intro">{t('loginIntro')}</p>
            <form onSubmit={submitParticipantId}>
              <label htmlFor="participant-id">{t('participantId')}</label>
              <input
                id="participant-id"
                name="participantId"
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck="false"
                placeholder={t('participantIdPlaceholder')}
                value={participantId}
                onChange={e => { setParticipantId(e.target.value.toUpperCase()); setLoginError(''); }}
                required
              />
              {loginError && <p className="participant-error" role="alert">{t(loginError)}</p>}
              <button className="participant-action" type="submit">{t('submitId')}</button>
            </form>
          </section>
        )}
      </>
    );
  }
  return (<>
    <div className="glow" aria-hidden="true" />
    <canvas id="fx" ref={cv} aria-hidden="true" />
    <header className="lb-bar">
      <a className="brand" href={MAIN} aria-label={t('institutionName')}>
        <img src={`${process.env.BASE_PATH}/assets/BUEN-Logo-header.png`} alt="" width="380" height="99" />
      </a>
      {languageControl(false)}
      <button className="participant-logout" type="button" onClick={logoutParticipant}>{t('switchAccount')}</button>
    </header>
    <main className="wrap">
      <div className="lb-head">
        <p className="eyebrow">{translateValue(kicker)}</p>
        <h1>{translateValue(title)}</h1>
        <p className="lb-subtitle">{t('subtitle')}</p>
        {updated && <p className="lead"><span>{t('updated')}</span> <span>{updated}</span></p>}
        {countdown?.to && <Countdown to={countdown.to} label={translateValue(countdown.label || '')} t={t} />}
      </div>
      {rows.length > 0 && <ol className="podium" aria-label={t('topThree')}>
        {rows.slice(0, 3).map((p, i) => (
          <li key={p.id} className={`pod pod${i + 1}`} style={{ '--i': i }}>
            <span className="pod-pic">
              {i === 0 && <svg className="pod-crown" viewBox="0 0 32 32" role="img" aria-label={t('champion')}>
                <path d="M4 23 2 9l8 5 6-10 6 10 8-5-2 14H4Zm1 3h22v3H5v-3Z" />
              </svg>}
              {pic(p, false)}
              <span className="pod-rank" aria-label={`${t('rank')} ${i + 1}`}>{i + 1}</span>
            </span>
            <span className="id">{p.id}</span>
            <strong translate="no">{p.name}</strong>
            {p.major && <small>{translateValue(p.major)}</small>}
            <span className="pod-ft">{badges(p)}</span>
            <span className="pod-total">{p.total}<small>{t('total')}</small></span>
            <dl>{ws.map(w => <div key={w.id}><dt>{translateValue(w.name)}</dt><dd>{p.points?.[w.id] ?? '–'}</dd></div>)}</dl>
          </li>
        ))}
      </ol>}
      <div className="lb-scroll"><table className="lb">
        <thead><tr><th>{t('rank')}</th><th></th><th>{t('participant')}</th>{ws.map(w => <th className="num" key={w.id}>{translateValue(w.name)}</th>)}<th className="num">{t('total')}</th></tr></thead>
        <tbody>
          {rows.length ? rows.map((p, i) => {
            const rank = i + 1;
            if (rank <= 3) return null; // top 3 are on the podium
            return [
              rank === CUT + 1 && <tr className="cut" key="cut"><td colSpan={cols}><span>{t('eliminated')}</span></td></tr>,
              <tr key={p.id} className={rank > CUT ? 'out' : undefined} style={{ '--i': i - 3 }}>
                <td>{rank}</td>
                <td className="pic">{pic(p)}</td>
                <td><div className="who">
                  <span className="id">{p.id}</span><strong translate="no">{p.name}</strong>
                  {badges(p)}
                  {p.major && <small>{translateValue(p.major)}</small>}
                </div></td>
                {ws.map(w => <td className="num" key={w.id}>{p.points?.[w.id] ?? '–'}</td>)}
                <td className="num">{p.total}</td>
              </tr>,
            ];
          }) : <tr><td colSpan={cols}>{t('noResults')}</td></tr>}
        </tbody>
      </table></div>
    </main>
    <footer className="lb-foot wrap">&copy; {t('institutionName')}</footer>
  </>);
}

// Countdown to `to` (ISO date with timezone). Renders only after mount: the build-time HTML can't know the visitor's clock.
function Countdown({ to, label, t }) {
  const [now, setNow] = useState(null);
  useEffect(() => { setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const left = Math.max(0, Date.parse(to) - (now ?? 0)) / 1000 | 0;
  const parts = [['days', left / 86400 | 0], ['hours', left / 3600 % 24 | 0], ['minutes', left / 60 % 60 | 0], ['seconds', left % 60]];
  return (
    <div className="cd" role="timer" aria-label={label}>
      {label && <p className="cd-label">{label}</p>}
      {now !== null && left === 0 ? <p className="cd-done">{t('timesUp')}</p> : (
        <div className="cd-units">{parts.map(([u, n]) => <span key={u}><b>{now === null ? '--' : String(n).padStart(2, '0')}</b><small>{t(u)}</small></span>)}</div>
      )}
    </div>
  );
}
