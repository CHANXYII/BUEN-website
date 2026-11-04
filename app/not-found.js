import Link from 'next/link';
import { T } from '@/components/Lang';

export default function NotFound() {
  return (
    <section className="contact" id="top">
      <div className="wrap">
        <h2><T>Page not found</T></h2>
        <p><Link className="btn primary" href="/"><T>Back to home</T></Link></p>
      </div>
    </section>
  );
}
