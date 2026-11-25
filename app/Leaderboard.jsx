'use client';
import { useEffect, useState } from 'react';
import { translations } from './i18n/translations';

const CUT = 16;
const MAIN = 'https://www.bu.ac.th/th/engineering';
const PARTICIPANT_KEY = 'buen-participant-id';
const ENTERED_KEY = 'buen-leaderboard-entered';
const LANGUAGE_KEY = 'buen_lang';
const LANGUAGES = ['en', 'th'];

function ParticipantPortrait({ participant, lazy = true }) {
  const [failed, setFailed] = useState(false);
  if (!participant.photo || failed) {
    return <span className="portrait-fallback" aria-hidden="true">{participant.id}</span>;
  }
  return (
    <img
      src={participant.photo}
      alt=""
      loading={lazy ? 'lazy' : undefined}
      onError={() => setFailed(true)}
    />
  );
}

export default function Leaderboard({ kicker, title, updated, countdown, workshops: ws, rows }) {
  const [lang, setLang] = useState('en');
  const [languageReady, setLanguageReady] = useState(false);
  const [languageError, setLanguageError] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [participant, setParticipant] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const t = key => translations[lang][key] ?? key;
  const translateValue = value => value === title
    ? t('pageTitle')
    : value === kicker
      ? t('category')
      : value === 'Final round'
        ? t('finalRound')
        : translations[lang].workshopNames[value] ?? translations[lang].majorNames[value] ?? value;

  useEffect(() => {
    let hasStoredEntry = false;
    try {
      const savedId = localStorage.getItem(PARTICIPANT_KEY);
      const index = rows.findIndex(p => p.id.toUpperCase() === savedId?.toUpperCase());
      if (index !== -1) {
        setParticipant({ person: rows[index], rank: index + 1 });
        setParticipantId(rows[index].id);
        hasStoredEntry = localStorage.getItem(ENTERED_KEY) === 'true';
        setHasEntered(hasStoredEntry);
      }
    } catch {
      setLoginError('readStatusError');
    } finally {
      setDrawerOpen(!hasStoredEntry);
      setAuthReady(true);
    }
  }, [rows]);

  useEffect(() => {
    let initialLanguage = 'en';
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      if (Object.hasOwn(translations, savedLanguage)) initialLanguage = savedLanguage;
      else initialLanguage = LANGUAGES.find(locale => navigator.language.toLowerCase().startsWith(locale)) ?? 'en';
    } catch {
      initialLanguage = LANGUAGES.find(locale => navigator.language.toLowerCase().startsWith(locale)) ?? 'en';
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

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = event => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const updateParallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--scroll-depth', `${window.scrollY * -0.14}px`);
      });
    };
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
    return () => {
      window.removeEventListener('scroll', updateParallax);
      cancelAnimationFrame(frame);
    };
  }, []);

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

  const submitParticipantId = event => {
    event.preventDefault();
    const normalizedId = participantId.trim().toUpperCase();
    const index = rows.findIndex(p => p.id.toUpperCase() === normalizedId);
    if (index === -1) {
      setLoginError('notFound');
      return;
    }
    setParticipant({ person: rows[index], rank: index + 1 });
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
    setDrawerOpen(false);
  };

  const switchAccount = () => {
    try {
      localStorage.removeItem(PARTICIPANT_KEY);
      localStorage.removeItem(ENTERED_KEY);
    } catch {
      setLoginError('removeLoginError');
    }
    setParticipant(null);
    setParticipantId('');
    setLoginError('');
    setHasEntered(false);
  };

  const openParticipant = (person, rank) => {
    setParticipant({ person, rank });
    setParticipantId(person.id);
    setLoginError('');
    setDrawerOpen(true);
  };

  const languageControl = (
    <div className="language-control" role="group" aria-label={t('switchLanguage')}>
      {LANGUAGES.map((locale, index) => (
        <span className="language-option" key={locale}>
          {index > 0 && <span aria-hidden="true">/</span>}
          <button
            type="button"
            aria-pressed={lang === locale}
            disabled={!languageReady}
            onClick={() => selectLanguage(locale)}
          >
            {locale.toUpperCase()}
          </button>
        </span>
      ))}
      {languageError && <span className="language-error" role="alert">{t(languageError)}</span>}
    </div>
  );

  const cols = ws.length + 4;

  return (
    <>
      <div className="atmosphere" aria-hidden="true" />
      <div className="watermark" aria-hidden="true">
        <span>2027</span>
        <span>THE NEXT GENERATION</span>
      </div>
      <header className="lb-bar">
        <a className="brand" href={MAIN} aria-label={t('institutionName')}>
          <img src={`${process.env.BASE_PATH}/assets/BUEN-Logo-header.png`} alt="" width="380" height="99" />
        </a>
        <div className="nav-actions">
          {languageControl}
          <button
            className="menu-toggle"
            type="button"
            aria-label={t('openPortal')}
            aria-expanded={drawerOpen}
            aria-controls="personal-portal"
            onClick={() => setDrawerOpen(true)}
            disabled={!authReady}
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </header>

      {!authReady ? (
        <main className="loading-view" role="status">{t('loadingParticipants')}</main>
      ) : hasEntered ? (
        <>
          <main className="wrap page-shell">
            <div className="lb-head">
              <p className="eyebrow">{translateValue(kicker)}</p>
              <h1>{translateValue(title)}</h1>
              <p className="lb-subtitle">{t('subtitle')}</p>
              {updated && <p className="lead"><span>{t('updated')}</span> <span>{updated}</span></p>}
              {countdown?.to && <Countdown to={countdown.to} label={translateValue(countdown.label || '')} t={t} />}
            </div>
            {rows.length > 0 && (
              <ol className="podium" aria-label={t('topThree')}>
                {rows.slice(0, 3).map((person, index) => (
                  <li
                    key={person.id}
                    className={`pod pod${index + 1}`}
                    style={{ '--i': index }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${t('openParticipantResult')} ${person.id}`}
                    onClick={() => openParticipant(person, index + 1)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openParticipant(person, index + 1);
                      }
                    }}
                  >
                    <ParticipantPortrait participant={person} lazy={false} />
                    <span className="pod-rank" aria-label={`${t('rank')} ${index + 1}`}>0{index + 1}</span>
                    <div className="pod-info">
                      <span className="id">{person.id}</span>
                      <strong translate="no">{person.name}</strong>
                      {person.major && <small>{translateValue(person.major)}</small>}
                      <span className="pod-total">{person.total}<small>{t('total')}</small></span>
                      <dl>
                        {ws.map(workshop => (
                          <div key={workshop.id}>
                            <dt>{translateValue(workshop.name)}</dt>
                            <dd>{person.points?.[workshop.id] ?? '–'}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            <div className="lb-scroll">
              <table className="lb">
                <thead>
                  <tr>
                    <th>{t('rank')}</th>
                    <th></th>
                    <th>{t('participant')}</th>
                    {ws.map(workshop => <th className="num" key={workshop.id}>{translateValue(workshop.name)}</th>)}
                    <th className="num">{t('total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length ? rows.map((person, index) => {
                    const rank = index + 1;
                    if (rank <= 3) return null;
                    return [
                      rank === CUT + 1 && (
                        <tr className="cut" key="cut">
                          <td colSpan={cols}><span>{t('eliminated')}</span></td>
                        </tr>
                      ),
                      <tr
                        key={person.id}
                        className={rank > CUT ? 'out' : undefined}
                        style={{ '--i': index - 3 }}
                        role="button"
                        tabIndex={0}
                        aria-label={`${t('openParticipantResult')} ${person.id}`}
                        onClick={() => openParticipant(person, rank)}
                        onKeyDown={event => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openParticipant(person, rank);
                          }
                        }}
                      >
                        <td>{rank}</td>
                        <td className="pic"><ParticipantPortrait participant={person} /></td>
                        <td>
                          <div className="who">
                            <span className="id">{person.id}</span>
                            <strong translate="no">{person.name}</strong>
                            {person.major && <small>{translateValue(person.major)}</small>}
                          </div>
                        </td>
                        {ws.map(workshop => <td className="num" key={workshop.id}>{person.points?.[workshop.id] ?? '–'}</td>)}
                        <td className="num">{person.total}</td>
                      </tr>,
                    ];
                  }) : <tr><td colSpan={cols}>{t('noResults')}</td></tr>}
                </tbody>
              </table>
            </div>
          </main>
          <footer className="lb-foot wrap">&copy; {t('institutionName')}</footer>
        </>
      ) : (
        <main className="portal-landing page-shell">
          <p className="eyebrow">{translateValue(kicker)}</p>
          <h1>{t('portalLandingTitle')}</h1>
          <p>{t('portalLandingIntro')}</p>
          <button className="text-action" type="button" onClick={() => setDrawerOpen(true)}>{t('openPortal')}</button>
        </main>
      )}

      {drawerOpen && authReady && (
        <div className={`portal-layer${hasEntered ? '' : ' portal-centered-layer'}`}>
          <button className="portal-scrim" type="button" aria-label={t('closePortal')} onClick={() => setDrawerOpen(false)} />
          <aside
            className="portal-drawer"
            id="personal-portal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portal-title"
          >
            <div className="portal-heading">
              <p className="participant-eyebrow">{t('portalLabel')}</p>
              <button className="portal-close" type="button" aria-label={t('closePortal')} onClick={() => setDrawerOpen(false)}>×</button>
            </div>
            {participant ? (
              <section className={`portal-result ${participant.rank <= CUT ? 'is-finalist' : 'is-eliminated'}`}>
                <div className="portal-result-title">
                  <ParticipantPortrait participant={participant.person} />
                  <div>
                    <p className="participant-eyebrow">{participant.rank <= CUT ? t('finalistEyebrow') : t('participantResultEyebrow')}</p>
                    <h2 id="portal-title">{participant.rank <= CUT ? t('congratulationsTitle') : t('eliminatedTitle')}</h2>
                  </div>
                </div>
                <p className="participant-intro">{participant.rank <= CUT ? t('congratulationsMessage') : t('eliminatedMessage')}</p>
                <div className="participant-details">
                  <p><span>{t('participantCode')}</span><strong>{participant.person.id}</strong></p>
                  <p><span>{t('participantName')}</span><strong translate="no">{participant.person.name}</strong></p>
                  {participant.person.major && <p><span>{t('major')}</span><strong>{translateValue(participant.person.major)}</strong></p>}
                  <p className="participant-rank"><span>{t('currentRank')}</span><strong>{t('rank')} {participant.rank}</strong></p>
                  <p><span>{t('score')}</span><strong>{participant.person.total}</strong></p>
                </div>
                <h3 className="workshop-heading">{t('workshopBreakdown')}</h3>
                <dl className="portal-workshops">
                  {ws.map(workshop => (
                    <div key={workshop.id}>
                      <dt>{translateValue(workshop.name)}</dt>
                      <dd>{participant.person.points?.[workshop.id] ?? '–'}</dd>
                    </div>
                  ))}
                </dl>
                {loginError && <p className="participant-error" role="alert">{t(loginError)}</p>}
                <div className="portal-actions">
                  <button className="participant-action" type="button" onClick={hasEntered ? () => setDrawerOpen(false) : enterLeaderboard}>
                    {hasEntered ? t('closePortal') : t('enterLeaderboard')}
                  </button>
                  <button className="text-action" type="button" onClick={switchAccount}>{t('switchAccount')}</button>
                </div>
              </section>
            ) : (
              <section className="portal-login">
                <h2 id="portal-title">{t('loginTitle')}</h2>
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
                    onChange={event => { setParticipantId(event.target.value.toUpperCase()); setLoginError(''); }}
                    required
                  />
                  {loginError && <p className="participant-error" role="alert">{t(loginError)}</p>}
                  <button className="participant-action" type="submit">{t('submitId')}</button>
                </form>
              </section>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

function Countdown({ to, label, t }) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const left = Math.max(0, Date.parse(to) - (now ?? 0)) / 1000 | 0;
  const parts = [['days', left / 86400 | 0], ['hours', left / 3600 % 24 | 0], ['minutes', left / 60 % 60 | 0], ['seconds', left % 60]];
  return (
    <div className="cd" role="timer" aria-label={label}>
      {label && <p className="cd-label">{label}</p>}
      {now !== null && left === 0 ? <p className="cd-done">{t('timesUp')}</p> : (
        <div className="cd-units">{parts.map(([unit, value]) => <span key={unit}><b>{now === null ? '--' : String(value).padStart(2, '0')}</b><small>{t(unit)}</small></span>)}</div>
      )}
    </div>
  );
}
