'use client';
// Fades its block in when scrolled into view; cards, photos and list items inside pop in one after another.
import { useEffect, useRef, useState } from 'react';

export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    el.querySelectorAll('.person,.shot,.list li').forEach((c, i) => { c.classList.add('item'); c.style.setProperty('--i', i); });
    // Shows once the block's top is 10% up from the bottom of the screen. Not a share-of-the-block threshold: that never
    // fires for blocks much taller than the screen (like the generation banners), which then stay invisible.
    // The scroll check backs up the observer, so a block can never be stuck invisible.
    let io;
    const off = () => { io?.disconnect(); removeEventListener('scroll', check); removeEventListener('resize', check); };
    const show = () => { setInView(true); off(); };
    function check() { const r = el.getBoundingClientRect(); if (r.top < innerHeight * 0.9 && r.bottom > 0) show(); }
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) show(); }, { rootMargin: '0px 0px -10% 0px' });
      io.observe(el);
    }
    addEventListener('scroll', check, { passive: true });
    addEventListener('resize', check);
    check();
    return off;
  }, []);
  return <Tag ref={ref} className={`${className} reveal${inView ? ' in' : ''}`} {...rest}>{children}</Tag>;
}
