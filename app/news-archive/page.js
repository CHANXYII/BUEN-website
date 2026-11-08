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
    <section className="news-archive" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="wrap">
        <div style={{ marginBottom: '32px' }}>
          <Link className="back-button" href="/#news">
            <span aria-hidden="true">←</span> <T>Back to Home</T>
          </Link>
        </div>

        <header style={{ marginBottom: '56px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '8px' }}><T>News Archive</T></h1>
          <p className="sub" style={{ fontSize: '1.2rem', color: 'var(--muted, #5f5d58)' }}><T>Latest stories from Bangkok University</T></p>
        </header>

        <CategorySlider title={<T>BU PRIDE</T>} stories={categorizedStories.pride} />
        <CategorySlider title={<T>BU NEWS</T>} stories={categorizedStories.news} />
        <CategorySlider title={<T>BU Insight</T>} stories={categorizedStories.insight} />
      </div>
    </section>
  );
}