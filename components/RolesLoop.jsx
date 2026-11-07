'use client';
// "What we do ?" row: endless loop. A hidden copy of the cards follows the real ones, so the CSS animation (slide left
// by one set) repeats without a jump. Speed: ~4 s per name. With reduced motion it is a plain swipeable row.
import { useEffect, useState } from 'react';
import { T } from './Languages';

export default function RolesLoop({ roles }) {
  const [loop, setLoop] = useState(false);
  useEffect(() => setLoop(!matchMedia('(prefers-reduced-motion:reduce)').matches), []);
  return (
    <div className="roles-loop">
      <ul className="roles-track" style={loop ? { '--dur': `${roles.length * 4}s` } : undefined}>
        {roles.map(r => <li className="role" key={r}><T>{r}</T></li>)}
        {loop && roles.map(r => <li className="role" key={`copy-${r}`} aria-hidden="true"><T>{r}</T></li>)}
      </ul>
    </div>
  );
}
