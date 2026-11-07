import { getArchiveStories } from '@/lib/featured-news';
import { T } from '@/components/Languages';
import CategorySlider from '@/components/CategorySlider';

export const metadata = {
  title: 'News Archive',
  description: 'Browse the latest stories from Bangkok University.',
};

export default async function NewsArchivePage() {
  const stories = await getArchiveStories();

  return (
    <section className="news-archive" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="wrap">
        <h1><T>News Archive</T></h1>
        <p className="sub"><T>Latest stories from Bangkok University</T></p>
        <CategorySlider title={<T>BU PRIDE</T>} stories={stories.pride} />
        <CategorySlider title={<T>BU NEWS</T>} stories={stories.news} />
        <CategorySlider title={<T>BU Insight</T>} stories={stories.insight} />
      </div>
    </section>
  );
}