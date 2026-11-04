'use client';
// Copyright line (current year) and back-to-top link.
import { useEffect, useState } from 'react';
import { site } from '@/content/site';
import { T } from './Lang';

export default function Footer() {
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return (
    <footer className="site-footer" id="footer">
      <div className="wrap">
        <p>&copy; <span id="year">{year}</span> <span><T>{site.name}</T></span></p>
        <p><a href="#top"><T>Back to top</T></a></p>
      </div>
    </footer>
  );
}
