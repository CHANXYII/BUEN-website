'use client';
import { useRef } from 'react';
import { T } from './Languages';

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
          <article className="news-card" key={story.link} style={{ animationDelay: `${index * 0.1}s` }}>
            <a className="news-card-link" href={story.link} target="_blank" rel="noopener noreferrer">
              <div className="news-card-image">
                <img src={story.image} alt="" loading="lazy" />
                <span className="news-card-kicker"><T>BU Stories</T></span>
                <div className="news-card-popup">
                  <T>Read Article</T> <span>↗</span>
                </div>
              </div>
              <div className="news-card-content">
                <time dateTime={story.dateTime}>{story.date}</time>
                <h3>{story.title}</h3>
                {story.excerpt && <p>{story.excerpt}</p>}
                <span className="news-card-action"><T>Read full story</T><span aria-hidden="true">↗</span></span>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}