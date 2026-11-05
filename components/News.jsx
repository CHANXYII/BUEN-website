import { getFeaturedStories } from '@/lib/featured-news';
import FeaturedNewsSlider from './FeaturedNewsSlider';
import { T } from './Lang';
import Reveal from './Reveal';

export default async function News() {
  const stories = await getFeaturedStories();
  return (
    <Reveal as="section" className="news" id="news">
      <div className="wrap">
        <h2><T>News &amp; Events</T></h2>
        <p className="sub"><T>Latest stories from Bangkok University</T></p>
        {stories.length > 0 ? (
          <FeaturedNewsSlider stories={stories} />
        ) : (
          <div className="feature">
            <div className="feature-img"></div>
            <div className="feature-text">
              <p className="tag"><T>Featured story</T></p>
              <h3><T>Latest stories are unavailable</T></h3>
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}
