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

        <header className="news-archive-header">
          <h1 className="news-archive-title"><T>News Archive</T></h1>
          <p className="news-archive-subtitle"><T>Latest stories from Bangkok University</T></p>
        </header>

        <CategorySlider title={<T>BU PRIDE</T>} stories={categorizedStories.pride} />
        <CategorySlider title={<T>BU NEWS</T>} stories={categorizedStories.news} />
        <CategorySlider title={<T>BU Insight</T>} stories={categorizedStories.insight} />
      </div>
    </section>
  );
}
