'use client';
import { T } from './Languages';
import NewsCard from './NewsCard';
import Reveal from './Reveal';

export default function CategorySlider({ title, subtitle, stories }) {
  if (!stories || stories.length === 0) {
    return (
      <div className="category-section">
        <div className="category-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="sub">{subtitle}</p>}
          </div>
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
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="sub">{subtitle}</p>}
        </div>
      </div>

      <div className="slider-track">
        {stories.map((story, index) => (
          <Reveal key={story.link} style={{ transitionDelay: `${Math.min(index, 2) * 0.15}s` }}>
            <NewsCard story={story} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
