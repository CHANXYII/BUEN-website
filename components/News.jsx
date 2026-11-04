// News & Events. Items: content/news.js.
import { feature, items } from '@/content/news';
import { asset } from '@/lib/asset';
import { T } from './Lang';
import Reveal from './Reveal';

export default function News() {
  return (
    <Reveal as="section" className="news" id="news">
      <div className="wrap">
        <h2><T>News &amp; Events</T></h2>
        <p className="sub"><T>Sample items. TODO: replace with real announcements.</T></p>

        <article className="feature">
          <div className="feature-img" style={feature.image ? { '--img': `url(${asset(feature.image)})` } : undefined}></div>
          <div className="feature-text">
            <p className="tag"><T>{feature.tag}</T></p>
            <time dateTime={feature.date}><T>{feature.dateLabel}</T></time>
            <h3><T>{feature.title}</T></h3>
            <p><T>{feature.text}</T></p>
            <a className="btn primary" href={feature.link} target="_blank" rel="noopener"><T>Read on BU website</T></a>
          </div>
        </article>

        <h3 className="group more"><T>More news</T></h3>
        <ul className="list">
          {items.map(n => <li key={n.title}><time dateTime={n.date}><T>{n.dateLabel}</T></time><h3><T>{n.title}</T></h3></li>)}
        </ul>
      </div>
    </Reveal>
  );
}
