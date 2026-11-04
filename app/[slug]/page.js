// Ambassador profile links (/name, ...): the home page with that profile open. One page is built per member.
import Home from '@/components/Home';
import { profiles } from '@/lib/profiles';

export const dynamicParams = false;

export const generateStaticParams = () => Object.keys(profiles).map(slug => ({ slug }));

export async function generateMetadata({ params }) {
  const p = profiles[(await params).slug];
  return { title: p.name, description: `${p.name}, BUEN Ambassador: ${p.major.replace(/ /g, ' ')}, ${p.year}.` };
}

export default Home;
