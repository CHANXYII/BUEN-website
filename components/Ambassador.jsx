'use client';
// BUEN Ambassador section. All text, people and photos: content/ambassador.js.
import { useState } from 'react';
import { advisor, generations, intro, links, presidents, videos, what } from '@/content/ambassador';
import { openProfile } from './ProfileDialog';
import { slugOf } from '@/lib/profiles';
import { T } from './Lang';
import PresidentSlider from './PresidentSlider';
import Reveal from './Reveal';
import VideoPlaylist from './VideoPlaylist';
import { Links, Marquee, Person, Shots, Slide, Tabs, WhatIs } from './ui';

export default function Ambassador() {
  // The generation tabs above the profiles also switch the work gallery below, which has no tabs of its own.
  const [gen, setGen] = useState(generations[0].gen);
  return (
    <section className="ambassador" id="ambassador">
      <div className="wrap">
        <Reveal className="block" id="amb-video">
          <h3 className="group"><T>About Us</T></h3>
          <VideoPlaylist ids={videos} />
          <div className="about"><p className="intro"><T>{intro}</T></p></div>
        </Reveal>

        {/* divider: faculty details above, student activities below */}
        <Reveal className="block" id="amb-break">
          <p className="eyebrow"><T>Beyond the classroom</T></p>
          <h2><T>Student Activities</T></h2>
        </Reveal>

        <WhatIs id="amb-what" {...what} />

        <Reveal className="block banner" id="amb-advisor">
          <Marquee word="Advisor" n={4} />
          <Slide person={advisor} />
        </Reveal>

        <Reveal className="block banner" id="amb-presidents">
          <Marquee word="President" />
          <PresidentSlider presidents={presidents} />
        </Reveal>

        {/* clicking a card (or Enter) opens that ambassador's profile page */}
        <Reveal className="block" id="amb-generations">
          <Tabs items={generations.map(g => ({ id: g.gen, label: `Generation ${g.gen}` }))} value={gen} onChange={setGen} />
          {generations.map(g => (
            <div key={g.gen} className="gen-panel people" role="tabpanel" data-gen={g.gen} hidden={g.gen !== gen}>
              {g.members.map(m => {
                const open = () => openProfile(slugOf(m.name));
                return <Person key={m.name} person={m} more onClick={open} onKeyDown={e => e.key === 'Enter' && open()} />;
              })}
            </div>
          ))}
        </Reveal>

        <Reveal className="block" id="amb-work">
          {generations.map(g => (
            <div key={g.gen} className="gen-panel gallery" role="tabpanel" data-gen={g.gen} hidden={g.gen !== gen}>
              <Shots items={g.gallery} />
            </div>
          ))}
        </Reveal>

        <Links links={links} />
      </div>
    </section>
  );
}
