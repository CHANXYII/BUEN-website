'use client';

import { useRouter } from 'next/navigation';

export default function WorkshopSelect({ workshops, selected }) {
  const router = useRouter();
  return <label className="workshop-filter"><span>Workshop</span><select value={selected} onChange={e => router.push(`/?workshop=${e.target.value}`)}>{workshops.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></label>;
}
