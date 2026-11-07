'use client';
import Link from 'next/link';
import { T } from './Languages';

export default function FeaturedNewsSlider({ stories }) {
  const visibleStories = stories.slice(0, 3);

  return (
    <div className="news-feed">
      <div className="news-grid">
        {visibleStories.map((story, index) => (
          <article
            className="news-card"
            key={story.link}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
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
      <div className="news-load-more-wrap">
        <Link className="news-load-more" href="/news-archive">
          <T>Show More</T>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}