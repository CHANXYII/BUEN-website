'use client';
// Ambassador profile: a full-screen dialog over the home page, at its own link (/joannes). The URL decides what is
// open, so clicking a card, opening the link directly and browser back/forward all work the same way.
// Content comes from the member in content/ambassador.js; see lib/profiles.js.
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { site } from '@/content/site';
import { generationRole, profiles } from '@/lib/profiles';
import { T, useLang } from './Languages';
import { Marquee, Shots, Slide } from './ui';

const base = process.env.NEXT_PUBLIC_BASE_PATH;
let pushed = false; // true when we added the history entry, so closing can just go back

export const openProfile = slug => { history.pushState(null, '', `${base}/${slug}/`); pushed = true; };

export default function ProfileDialog() {
  const slug = decodeURIComponent(usePathname().split('/').filter(Boolean).pop() ?? '').toLowerCase();
  const p = profiles[slug];
  const last = useRef(p); // keep showing the last profile while the dialog closes
  if (p) last.current = p;
  const cur = last.current;
  const dlg = useRef(null);
  const { lang, t } = useLang();

  useEffect(() => {
    const d = dlg.current;
    if (p) { if (!d.open) d.showModal(); d.scrollTop = 0; } else if (d.open) d.close();
  }, [p]);

  // Tab title in the current language. Next.js writes its own (English) <title> after load, so keep ours on top.
  useEffect(() => {
    const title = lang.dict.title ?? site.title;
    const want = p ? `${t(p.name)} | ${title}` : title;
    const set = () => { if (document.title !== want) document.title = want; };
    set();
    const mo = new MutationObserver(set);
    mo.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => mo.disconnect();
  }, [p, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // Back button or Esc: leave the profile link (the URL change closes the dialog).
  const leave = () => {
    if (p) pushed ? history.back() : history.replaceState(null, '', `${base}/`);
    pushed = false;
  };

  return (
    <dialog className="profile" aria-label="Profile" ref={dlg} onCancel={e => { e.preventDefault(); leave(); }}>
      <button className="back" onClick={leave}>&#8592; <span><T>Back</T></span></button>
      {cur && <>
        <div className="banner in">
          <Marquee word="Ambassador" />
          {/* same slide as the president banner: name, major as the meta line, then under the divider the generation
              (highlighted, first line) and every position */}
          <Slide person={{ photo: cur.photo, name: cur.name, meta: cur.major,
            roles: [generationRole(cur.gen), ...(cur.positions || []), ...(cur.profileOnly || [])] }}
            // photos shrunk inside their PNG (smaller head, so a photoLift on the banner) are zoomed back up here so the
            // head fills the frame like everyone else's
            style={cur.photoLift && { '--zoom': 1 / (1 - parseFloat(cur.photoLift) / 100) }} />
        </div>
        {/* below the banner: the work gallery of this ambassador's generation */}
        <div className="profile-work wrap"><h2><T>Our work</T></h2><div className="gallery"><Shots items={cur.gallery} /></div></div>
      </>}
    </dialog>
  );
}
