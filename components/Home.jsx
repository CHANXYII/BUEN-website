// The one-page site, in page order. Add a section: create components/<Name>.jsx, add it here and link it in content/site.js.
import Ambassador from './Ambassador';
import Committee from './Committee';
import Contact from './Contact';
import Hero from './Hero';
import News from './News';
import ProfileDialog from './ProfileDialog';

export default function Home() {
  return (
    <>
      <Hero />
      <Ambassador />
      <ProfileDialog />
      <Committee />
      <News />
      <Contact />
    </>
  );
}
