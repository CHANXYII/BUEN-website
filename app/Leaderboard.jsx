'use client';
// Leaderboard UI: language menu, ember background, table. Rows arrive ranked from page.jsx.
import { useEffect, useRef, useState } from 'react';
import th from './i18n/th'; import zh from './i18n/zh'; import ja from './i18n/ja'; import ko from './i18n/ko';
import fr from './i18n/fr'; import es from './i18n/es'; import id from './i18n/id'; import fil from './i18n/fil';
import vi from './i18n/vi'; import my from './i18n/my'; import lo from './i18n/lo';

// Dictionaries map the English text to its translation; missing text stays English. Add a string: add the key to each app/i18n/*.js.
const DICT = { th, zh, ja, ko, fr, es, id, fil, vi, my, lo };
const LANGS = [['en', 'English', 'EN'], ['th', 'ไทย', 'ไทย'], ['zh', '中文 (简体)', '中文'], ['ja', '日本語', '日本語'], ['ko', '한국어', '한국어'], ['fr', 'Français', 'FR'], ['es', 'Español', 'ES'], ['id', 'Bahasa Indonesia', 'ID'], ['fil', 'Filipino', 'FIL'], ['vi', 'Tiếng Việt', 'VI'], ['my', 'မြန်မာ', 'မြန်မာ'], ['lo', 'ລາວ', 'ລາວ']];
const HTML_LANG = { zh: 'zh-Hans' };
const TITLE = 'Leaderboard | School of Engineering, Bangkok University';
const CUT = 16; // top 16 are finalists; rank 17 and below is eliminated
const MAIN = 'https://www.bu.ac.th/th/engineering';
const PARTICIPANT_KEY = 'buen-participant-id';
const ENTERED_KEY = 'buen-leaderboard-entered';

export default function Leaderboard({ kicker, title, updated, countdown, workshops: ws, rows, win }) {
  const [lang, setLang] = useState('en');
  const [open, setOpen] = useState(false);
  const [participantId, setParticipantId] = useState('');
  const [participant, setParticipant] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [loginError, setLoginError] = useState('');
  const box = useRef(), btn = useRef(), cv = useRef();
  const t = s => (lang === 'en' ? s : DICT[lang][s] ?? s);

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
      setLoginError('ไม่สามารถอ่านสถานะการเข้าสู่ระบบจากอุปกรณ์นี้ได้');
    } finally {
      setAuthReady(true);
    }
  }, [rows]);

  const submitParticipantId = e => {
    e.preventDefault();
    const normalizedId = participantId.trim().toUpperCase();
    const index = rows.findIndex(p => p.id.toUpperCase() === normalizedId);
    if (index === -1) {
      setLoginError('ไม่พบรหัสผู้เข้าแข่งขันในระบบ');
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
      setLoginError('เข้าสู่ระบบแล้ว แต่ไม่สามารถบันทึกสถานะบนอุปกรณ์นี้ได้');
    }
  };

  const enterLeaderboard = () => {
    try {
      localStorage.setItem(ENTERED_KEY, 'true');
    } catch {
      setLoginError('ไม่สามารถบันทึกสถานะบนอุปกรณ์นี้ได้');
    }
    setHasEntered(true);
    setLoginError('');
  };

  const logoutParticipant = () => {
    try {
      localStorage.removeItem(PARTICIPANT_KEY);
      localStorage.removeItem(ENTERED_KEY);
    } catch {
      setLoginError('ไม่สามารถลบสถานะการเข้าสู่ระบบจากอุปกรณ์นี้ได้');
    }
    setParticipant(null);
    setParticipantId('');
    setHasEntered(false);
  };

  // Saved language, else the browser language if supported.
  useEffect(() => {
    let l; try { l = localStorage.lang; } catch {}
    l ||= LANGS.find(([x]) => navigator.language.startsWith(x))?.[0];
    if (LANGS.some(([x]) => x === l)) setLang(l);
  }, []);
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang] || lang;
    document.title = lang === 'en' ? TITLE : DICT[lang].title;
    try { localStorage.lang = lang; } catch {}
  }, [lang]);

  // Close the menu on outside click or Escape.
  useEffect(() => {
    const click = e => { if (!box.current || !box.current.contains(e.target)) setOpen(false); };
    const key = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', click); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('click', click); document.removeEventListener('keydown', key); };
  }, []);

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
  const pic = (p, lazy = true) => p.photo ? <img src={p.photo} alt="" loading={lazy ? 'lazy' : undefined} /> : <span className="av" aria-hidden="true">{p.id.replace(/\D/g, '')}</span>;
  const badges = p => ws.map((w, k) => win[w.id] === p.id && (
    <span className="ft" key={w.id} title={`${w.name}: fast-track`} aria-label={`Fast-track ${k + 1}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg>{k + 1}
    </span>
  ));
  if (!authReady) {
    return (
      <>
        <div className="glow" aria-hidden="true" />
        <canvas id="fx" ref={cv} aria-hidden="true" />
        <div className="participant-loading" role="status">กำลังโหลดข้อมูลผู้เข้าแข่งขัน…</div>
      </>
    );
  }
  if (!hasEntered) {
    return (
      <>
        <div className="glow" aria-hidden="true" />
        <canvas id="fx" ref={cv} aria-hidden="true" />
        {participant ? (
          <section className={`participant-card ${participant.rank <= CUT ? 'is-finalist' : 'is-eliminated'}`} role="dialog" aria-modal="true" aria-labelledby="participant-result-title">
            {participant.rank <= CUT && <p className="participant-confetti" aria-hidden="true">🎉</p>}
            <p className="participant-eyebrow">{participant.rank <= CUT ? 'FINALIST · TOP 16' : 'PARTICIPANT RESULT'}</p>
            <h1 id="participant-result-title">
              {participant.rank <= CUT
                ? 'ขอแสดงความยินดีด้วย! คุณผ่านเข้ารอบ 16 คนสุดท้าย'
                : 'ขอแสดงความเสียใจด้วย คุณไม่ผ่านเข้ารอบ ขอบคุณที่ให้ความสนใจและร่วมเป็นส่วนหนึ่งของกิจกรรม'}
            </h1>
            <div className="participant-details">
              <p><span>รหัสผู้เข้าแข่งขัน</span><strong>{participant.person.id}</strong></p>
              <p><span>ชื่อผู้เข้าแข่งขัน</span><strong translate="no">{participant.person.name}</strong></p>
              <p className="participant-rank"><span>อันดับปัจจุบันของคุณ</span><strong>อันดับที่ {participant.rank}</strong></p>
              <p><span>คะแนนรวม</span><strong>{participant.person.total}</strong></p>
            </div>
            {loginError && <p className="participant-error" role="alert">{loginError}</p>}
            <button className="participant-action" type="button" onClick={enterLeaderboard}>เข้าสู่หน้า LEADERBOARD</button>
          </section>
        ) : (
          <section className="participant-login" aria-labelledby="participant-login-title">
            <p className="participant-eyebrow">BUEN AMBASSADOR · GENERATION 3</p>
            <h1 id="participant-login-title">Participant ID Login</h1>
            <p className="participant-intro">กรอกรหัสผู้เข้าแข่งขันเพื่อดูผลการเข้ารอบส่วนบุคคล</p>
            <form onSubmit={submitParticipantId}>
              <label htmlFor="participant-id">Participant ID</label>
              <input
                id="participant-id"
                name="participantId"
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck="false"
                placeholder="เช่น BUEN01"
                value={participantId}
                onChange={e => { setParticipantId(e.target.value.toUpperCase()); setLoginError(''); }}
                required
              />
              {loginError && <p className="participant-error" role="alert">{loginError}</p>}
              <button className="participant-action" type="submit">ยืนยันรหัสผู้เข้าแข่งขัน</button>
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
      <a className="brand" href={MAIN} aria-label="School of Engineering, Bangkok University">
        <img src={`${process.env.BASE_PATH}/assets/BUEN-Logo-header.png`} alt="" width="380" height="99" />
      </a>
      <div className="lang" ref={box}>
        <button ref={btn} className="lang-btn" aria-haspopup="true" aria-expanded={open} aria-controls="lang-list" aria-label="Language" onClick={() => setOpen(!open)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>
          <span className="lang-cur">{LANGS.find(([x]) => x === lang)[2]}</span><span className="caret" aria-hidden="true">&#9662;</span>
        </button>
        <ul className="lang-list" id="lang-list" role="menu" hidden={!open}>
          <li className="lang-title" role="presentation">Language / ภาษา / 语言 / 言語 / 언어 / Langue</li>
          {LANGS.map(([x, name]) => (
            <li role="none" key={x}>
              <button role="menuitemradio" className={x === lang ? 'on' : undefined} aria-checked={x === lang} onClick={() => { setLang(x); setOpen(false); btn.current.focus(); }}>{name}</button>
            </li>
          ))}
        </ul>
      </div>
      <button className="participant-logout" type="button" onClick={logoutParticipant}>สลับบัญชี</button>
    </header>
    <main className="wrap">
      <div className="lb-head">
        <p className="eyebrow">{t(kicker)}</p>
        <h1>{t(title)}</h1>
        <p className="lb-subtitle">Track live scores and rankings in real-time</p>
        {updated && <p className="lead"><span>{t('Updated')}</span> <span>{updated}</span></p>}
        {countdown?.to && <Countdown to={countdown.to} label={t(countdown.label || '')} t={t} />}
      </div>
      {rows.length > 0 && <ol className="podium" aria-label={t('Top 3')}>
        {rows.slice(0, 3).map((p, i) => (
          <li key={p.id} className={`pod pod${i + 1}`} style={{ '--i': i }}>
            <span className="pod-pic">{pic(p, false)}<span className="pod-rank" aria-label={`${t('Rank')} ${i + 1}`}>{i + 1}</span></span>
            <span className="id">{p.id}</span>
            <strong translate="no">{p.name}</strong>
            {p.major && <small>{t(p.major)}</small>}
            <span className="pod-ft">{badges(p)}</span>
            <span className="pod-total">{p.total}<small>{t('Total')}</small></span>
            <dl>{ws.map(w => <div key={w.id}><dt>{t(w.name)}</dt><dd>{p.points?.[w.id] ?? '–'}</dd></div>)}</dl>
          </li>
        ))}
      </ol>}
      <div className="lb-scroll"><table className="lb">
        <thead><tr><th>{t('Rank')}</th><th></th><th>{t('Participant')}</th>{ws.map(w => <th className="num" key={w.id}>{t(w.name)}</th>)}<th className="num">{t('Total')}</th></tr></thead>
        <tbody>
          {rows.length ? rows.map((p, i) => {
            const rank = i + 1;
            if (rank <= 3) return null; // top 3 are on the podium
            return [
              rank === CUT + 1 && <tr className="cut" key="cut"><td colSpan={cols}><span>{t('Eliminated')}</span></td></tr>,
              <tr key={p.id} className={rank > CUT ? 'out' : undefined} style={{ '--i': i - 3 }}>
                <td>{rank}</td>
                <td className="pic">{pic(p)}</td>
                <td><div className="who">
                  <span className="id">{p.id}</span><strong translate="no">{p.name}</strong>
                  {badges(p)}
                  {p.major && <small>{t(p.major)}</small>}
                </div></td>
                {ws.map(w => <td className="num" key={w.id}>{p.points?.[w.id] ?? '–'}</td>)}
                <td className="num">{p.total}</td>
              </tr>,
            ];
          }) : <tr><td colSpan={cols}>{t('No results yet.')}</td></tr>}
        </tbody>
      </table></div>
    </main>
    <footer className="lb-foot wrap">&copy; School of Engineering, Bangkok University</footer>
  </>);
}

// Countdown to `to` (ISO date with timezone). Renders only after mount: the build-time HTML can't know the visitor's clock.
function Countdown({ to, label, t }) {
  const [now, setNow] = useState(null);
  useEffect(() => { setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const left = Math.max(0, Date.parse(to) - (now ?? 0)) / 1000 | 0;
  const parts = [['Days', left / 86400 | 0], ['Hours', left / 3600 % 24 | 0], ['Minutes', left / 60 % 60 | 0], ['Seconds', left % 60]];
  return (
    <div className="cd" role="timer" aria-label={label}>
      {label && <p className="cd-label">{label}</p>}
      {now !== null && left === 0 ? <p className="cd-done">{t("Time's up")}</p> : (
        <div className="cd-units">{parts.map(([u, n]) => <span key={u}><b>{now === null ? '--' : String(n).padStart(2, '0')}</b><small>{t(u)}</small></span>)}</div>
      )}
    </div>
  );
}
