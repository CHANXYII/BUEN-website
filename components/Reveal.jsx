'use client';
// Fades its block in when scrolled into view; cards, photos and list items inside pop in one after another.
import { useEffect, useRef, useState } from 'react';

export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    el.querySelectorAll('.person,.shot,.list li').forEach((c, i) => { c.classList.add('item'); c.style.setProperty('--i', i); });
    if (!('IntersectionObserver' in window)) return setInView(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`${className} reveal${inView ? ' in' : ''}`} {...rest}>{children}</Tag>;
}
