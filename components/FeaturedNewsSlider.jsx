'use client';
import Link from 'next/link';
import { T } from './Languages';
import NewsCard from './NewsCard';
import Reveal from './Reveal';

export default function FeaturedNewsSlider({ stories }) {
  const visibleStories = stories.slice(0, 3);

  return (
    <div className="news-feed">
      <div className="news-grid">
        {visibleStories.map((story, index) => (
          <Reveal key={story.link} style={{ transitionDelay: `${index * 0.15}s` }}>
            <NewsCard story={story} />
          </Reveal>
        ))}
      </div>
      <div className="news-load-more-wrap">
        <Link className="news-load-more" href="/news-archive">
          <T>Show More</T>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}
