'use client';
// "About Us" videos: the IDs play as a looping playlist. Starts muted 2 s after scrolling into view (browsers block
// autoplay with sound), or with sound on click; arrows and a video ending jump to the next one and play it.
// No IDs = placeholder.
import { useEffect, useRef, useState } from 'react';
import { T } from './Lang';

const ORIGIN = 'https://www.youtube-nocookie.com';

export default function VideoPlaylist({ ids }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const box = useRef(null), frame = useRef(null);
  const id = encodeURIComponent(ids[i] || '');
  // YouTube cover: maxres when the video has one, hq underneath as fallback.
  const cover = id ? { background: `center/cover url(https://i.ytimg.com/vi/${id}/maxresdefault.jpg), center/cover url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` } : undefined;
  const go = n => { setI((n + ids.length) % ids.length || 0); setPlaying(true); };

  // enablejsapi: the player posts its state to us, so we know when the video ends.
  useEffect(() => {
    const onMessage = e => {
      if (e.origin !== ORIGIN || e.source !== frame.current?.contentWindow) return;
      let d; try { d = JSON.parse(e.data); } catch { return; }
      if ((d.event === 'onStateChange' ? d.info : d.info?.playerState) === 0) { setI(n => (n + 1) % ids.length); setPlaying(true); } // 0 = ended
    };
    addEventListener('message', onMessage);
    return () => removeEventListener('message', onMessage);
  }, [ids.length]);

  useEffect(() => {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    let t;
    const io = new IntersectionObserver(([e]) => {
      clearTimeout(t); // scrolled away before 2 s: wait again next time
      if (e.isIntersecting) t = setTimeout(() => { io.disconnect(); setPlaying(true); }, 2000);
    }, { threshold: 0.6 });
    io.observe(box.current);
    return () => { clearTimeout(t); io.disconnect(); };
  }, []);

  return (
    <div className="vids" ref={box}>
      {playing && id
        ? <iframe key={id} ref={frame} className="video" src={`${ORIGIN}/embed/${id}?autoplay=1&playsinline=1&enablejsapi=1${muted ? '&mute=1' : ''}`} title="BUEN video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen
            onLoad={e => e.currentTarget.contentWindow.postMessage('{"event":"listening"}', '*')}></iframe>
        : <button className="video" data-yt={id} aria-label="Play video" onClick={() => { setMuted(false); setPlaying(true); }} style={cover}>
            <span className="play">&#9654;</span><span className="soon"><T>Video coming soon</T></span>
          </button>}
      <button className="prev" aria-label="Previous video" hidden={ids.length < 2} onClick={() => go(i - 1)}>&#8249;</button>
      <button className="next" aria-label="Next video" hidden={ids.length < 2} onClick={() => go(i + 1)}>&#8250;</button>
    </div>
  );
}
