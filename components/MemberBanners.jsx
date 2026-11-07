'use client';
// Generation members as horizontal banners: frameless cut-out photo on the left (standing up out of the banner's top
// edge, cropped by its bottom edge, rising a little more on hover), info on the right. While the page scrolls, the
// text drifts a little (parallax).
// Each banner gets --p from -1 (below the viewport centre) to 1 (above it); the CSS turns that into movement.
// Scrolling down reveals the banners one at a time (class "shown"); under reduced motion they are all shown at once.
import { useEffect, useRef } from 'react';
import { openProfile } from './ProfileDialog';
import { slugOf } from '@/lib/profiles';
import { T, useLang } from './Languages';
import { Avatar } from './ui';

export default function MemberBanners({ members, active }) {
  const ref = useRef(null);
  const { lang } = useLang();

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = ref.current;
    root.classList.add('reveal-each'); // CSS hides banners only once this runs, so without JS they simply show
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = innerHeight;
      root.querySelectorAll('.member').forEach(el => {
        const r = el.getBoundingClientRect();
        if (!r.height) return; // hidden tab
        // one by one: a banner shows once its top passes 88% of the screen height, and stays shown. Anything already
        // scrolled past (e.g. after jumping further down the page) counts too, so everything above is always visible.
        if (r.top < vh * 0.88) el.classList.add('shown');
        if (r.bottom < -vh || r.top > 2 * vh) return; // far off screen: skip the parallax
        const p = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / vh));
        el.style.setProperty('--p', p.toFixed(3));
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);

  // a tab switch shows this panel: give its banners their offset right away, not on the next scroll
  useEffect(() => { if (active) dispatchEvent(new Event('scroll')); }, [active]);

  return (
    <div className="members" ref={ref}>
      {members.map(m => {
        const open = () => openProfile(slugOf(m.name));
        return (
          <article key={m.name} className="member" style={{ '--photo-x': m.photoX, '--photo-lift': m.photoLift }} tabIndex={0} onClick={open} onKeyDown={e => e.key === 'Enter' && open()}>
            <div className="member-photo"><Avatar photo={m.photo} name={m.name} /></div>
            <div className="member-info">
              <h4><T>{m.name}</T></h4>
              {!m.cardHideIn?.includes(lang.code) && m.positions?.map(x => <p className="position" key={x}><T>{x}</T></p>)}
              <p className="member-major"><T>{m.major}</T></p>
              <small><T>{m.year}</T></small>
              <span className="member-more"><T>Show more</T> <span aria-hidden="true">→</span></span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
