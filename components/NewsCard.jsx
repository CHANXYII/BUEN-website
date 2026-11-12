'use client';
import { T } from './Languages';

export default function NewsCard({ story, style }) {
  return (
    <article className="news-card" style={style}>
      <a className="news-card-link" href={story.link} target="_blank" rel="noopener noreferrer">
        <div className="news-card-image">
          <img src={story.image} alt="" loading="lazy" />
          <div className="news-card-popup">
            <T>Read full story</T> <span>↗</span>
          </div>
        </div>
        <div className="news-card-content">
          <time dateTime={story.dateTime}>{story.date}</time>
          <h3>{story.title}</h3>
          {story.excerpt && <p>{story.excerpt}</p>}
          <span className="news-card-action">
            <T>Read full story</T>
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </a>
    </article>
  );
}
