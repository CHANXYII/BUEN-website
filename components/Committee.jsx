'use client';
// Engineering Student Committee section. All text, people and photos: content/committee.js.
import { useState } from 'react';
import { what, years } from '@/content/committee';
import Reveal from './Reveal';
import { Links, Marquee, Person, Shots, Slide, Tabs, WhatIs } from './ui';

export default function Committee() {
  const [year, setYear] = useState(years[0].year);
  // The open group tab is kept when switching year (if that year has it).
  const [group, setGroup] = useState(years[0].groups[0].id);
  return (
    <section className="committee" id="committee">
      <div className="wrap">
        <WhatIs id="com-what" {...what} />

        <Tabs className="tabs year-tabs" items={years.map(y => ({ id: y.year, label: String(y.year) }))} value={year} onChange={setYear} />
        {years.map(y => {
          const g = y.groups.some(x => x.id === group) ? group : y.groups[0].id;
          return (
            <div key={y.year} className="year-panel" role="tabpanel" id={`year-${y.year}`} data-gen={y.year} hidden={y.year !== year}>
              <Reveal className="block banner com-president">
                <Marquee word="STAFFBUEN" />
                <Slide person={y.president} />
              </Reveal>

              <Reveal className="block com-members">
                <Tabs items={y.groups} value={g} onChange={setGroup} />
                {y.groups.map(x => (
                  <div key={x.id} className="gen-panel people" role="tabpanel" data-gen={x.id} hidden={x.id !== g}>
                    {x.members.map(m => <Person key={m.name} person={m} />)}
                  </div>
                ))}
              </Reveal>

              {y.groups.filter(x => x.gallery).map(x => (
                <Reveal key={x.id} className="gen-panel block com-work" role="tabpanel" data-gen={x.id} hidden={x.id !== g}>
                  <div className="gallery"><Shots items={x.gallery} /></div>
                </Reveal>
              ))}

              {/* social links switch with the group tabs */}
              {y.groups.map(x => (
                <div key={x.id} className="gen-panel" role="tabpanel" data-gen={x.id} hidden={x.id !== g}><Links links={x.links || []} spaced /></div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
