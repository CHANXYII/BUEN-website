'use client';
// Presidents slideshow: loops, autoplays every 5 s, pauses on hover/focus, buttons + dots + swipe.
import { useEffect, useRef, useState } from 'react';
import { Slide } from './ui';

export default function PresidentSlider({ presidents }) {
  const n = presidents.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const x0 = useRef(null);
  const go = k => setI((k + n) % n);

  // Any change of slide restarts the 5 s wait.
  useEffect(() => {
    if (paused || n < 2 || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const t = setTimeout(() => setI(k => (k + 1) % n), 5000);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  return (
    <div className="slider" aria-roledescription="carousel" aria-label="Presidents"
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onPointerDown={e => { x0.current = e.clientX; }}
      onPointerUp={e => { if (x0.current != null && Math.abs(e.clientX - x0.current) > 50) go(i + (e.clientX < x0.current ? 1 : -1)); x0.current = null; }}>
      <div className="track" style={{ transform: `translateX(${-i * 100}%)` }}>
        {presidents.map((p, k) => <Slide key={p.name + p.badge} person={p} inert={k !== i} />)}
      </div>
      {/* one president: nothing to slide */}
      <button className="prev" aria-label="Previous" hidden={n < 2} onClick={() => go(i - 1)}>&#8249;</button>
      <button className="next" aria-label="Next" hidden={n < 2} onClick={() => go(i + 1)}>&#8250;</button>
      <div className="dots" hidden={n < 2}>
        {presidents.map((p, k) => <button key={k} aria-label={`Generation ${k + 1}`} aria-current={k === i} onClick={() => go(k)}></button>)}
      </div>
    </div>
  );
}
