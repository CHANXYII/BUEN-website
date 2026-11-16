import { getFeaturedStories } from '@/lib/featured-news';
import FeaturedNewsSlider from './FeaturedNewsSlider';
import { T } from './Languages';
import Reveal from './Reveal';

export default async function News() {
  const stories = await getFeaturedStories();
  if (stories.length === 0) {
    throw new Error("Failed to fetch featured stories from bu.ac.th. Failing build to prevent empty news section.");
  }

  return (
    <Reveal as="section" className="news" id="news">
      <div className="wrap">
        <h2><T>News &amp; Events</T></h2>
        <p className="sub"><T>Engineering the future. Explore the latest innovations, projects, and stories from our community.</T></p>
        <FeaturedNewsSlider stories={stories} />
      </div>
    </Reveal>
  );
}
