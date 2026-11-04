'use client';
// Featured news slideshow. The active progress segment drives it: when its 7 s animation ends, go to the next slide.
// Slides: content/hero.js.
import { useRef, useState } from 'react';
import { heroImage, slides } from '@/content/hero';
import { asset } from '@/lib/asset';
import { T } from './Lang';

export default function Hero() {
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0); // remounts the active progress line, so its animation restarts
  const [video, setVideo] = useState(null); // open pop-up: YouTube ID, '' = "coming soon"; null = closed
  const dlg = useRef(null);
  const go = n => { setI((n + slides.length) % slides.length); setTick(t => t + 1); };
  const watch = id => { setVideo(id); dlg.current.showModal(); };

  return (
    <section className={`hero${video !== null ? ' paused' : ''}`} id="top">
      <div className="hero-slides">
        {slides.map((s, k) => (
          <article key={k} className={`hslide${k === i ? ' on' : ''}`} inert={k !== i} style={{ '--bg': `url(${asset(s.image || heroImage)})` }}>
            <div className="wrap">
              <p className="eyebrow"><T>{s.eyebrow}</T></p>
              <h1><T>{s.title}</T></h1>
              <p className="lead"><T>{s.lead}</T></p>
              <p className="cta">
                {'video' in s && <button className="btn primary watch" onClick={() => watch(s.video)}><T>Watch official video</T></button>}
                {s.buttons.map(b => b.href.startsWith('#')
                  ? <a key={b.href} className={`btn${b.primary ? ' primary' : ''}`} href={b.href}><T>{b.label}</T></a>
                  : <a key={b.href} className={`btn${b.primary ? ' primary' : ''}`} href={b.href} target="_blank" rel="noopener"><T>{b.label}</T></a>)}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="wrap segs" role="group" aria-label="Featured news" onAnimationEnd={() => go(i + 1)}>
        {slides.map((s, k) => (
          <button key={k} className={`seg${k === i ? ' on' : ''}`} onClick={() => go(k)}>
            <i key={k === i ? tick : 'off'}></i><b>{String(k + 1).padStart(2, '0')}</b><span><T>{s.tab}</T></span>
          </button>
        ))}
      </div>

      <dialog className="vmodal" aria-label="Video" ref={dlg} onClose={() => setVideo(null)} onClick={e => e.target === dlg.current && dlg.current.close()}>
        <button className="vclose" aria-label="Close" onClick={() => dlg.current.close()}>&times;</button>
        <div className="vbody">
          {video
            ? <iframe src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video)}?autoplay=1`} title="BU official video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen></iframe>
            : video === '' && <p className="soon"><T>Video coming soon</T></p>}
        </div>
      </dialog>
    </section>
  );
}
