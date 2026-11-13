import Link from 'next/link';
import { getArchiveStories } from '@/lib/featured-news';
import { T } from '@/components/Languages';
import CategorySlider from '@/components/CategorySlider';

export const metadata = {
  title: 'News Archive',
  description: 'Browse the latest stories from Bangkok University.',
};

export default async function NewsArchivePage() {
  const categorizedStories = await getArchiveStories();

  return (
    <section className="news-archive">
      <div className="wrap">
        <div className="news-archive-top">
          <Link className="back-button" href="/#news">
            <span aria-hidden="true">←</span> <T>Back to Home</T>
          </Link>
        </div>

        <CategorySlider title={<T>BU PRIDE</T>} subtitle={<T>Celebrating the achievements, awards, and milestones of our engineering community.</T>} stories={categorizedStories.pride} />
        <CategorySlider title={<T>BU NEWS</T>} subtitle={<T>Stay connected with the latest updates, events, and activities on campus.</T>} stories={categorizedStories.news} />
        <CategorySlider title={<T>BU Insight</T>} subtitle={<T>Deep dives into engineering innovations, research, and technology trends.</T>} stories={categorizedStories.insight} />
      </div>
    </section>
  );
}
