'use client';
import { useRef } from 'react';
import { T } from './Languages';
import NewsCard from './NewsCard';
import Reveal from './Reveal';

export default function CategorySlider({ title, stories }) {
  const trackRef = useRef(null);

  const scroll = direction => {
    if (!trackRef.current) return;
    const distance = Math.max(trackRef.current.clientWidth * 0.85, 280);
    trackRef.current.scrollBy({ left: distance * direction, behavior: 'smooth' });
  };

  if (!stories || stories.length === 0) {
    return (
      <div className="category-section">
        <div className="category-header">
          <h2>{title}</h2>
        </div>
        <div className="empty-category">
          <T>Content coming soon. Links will be populated here.</T>
        </div>
      </div>
    );
  }

  return (
    <div className="category-section">
      <div className="category-header">
        <h2>{title}</h2>
        <div className="slider-controls">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous stories">←</button>
          <button type="button" onClick={() => scroll(1)} aria-label="Next stories">→</button>
        </div>
      </div>

      <div className="slider-track" ref={trackRef}>
        {stories.map((story, index) => (
          <Reveal key={story.link} style={{ transitionDelay: `${Math.min(index, 2) * 0.15}s` }}>
            <NewsCard story={story} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
