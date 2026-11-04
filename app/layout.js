// Page shell shared by every route: fonts, styles, header and footer.
import { site } from '@/content/site';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { LangProvider } from '@/components/Lang';
import '@/styles/base.css';
import '@/styles/header.css';
import '@/styles/hero.css';
import '@/styles/ambassador.css';
import '@/styles/ambassador-profile.css';
import '@/styles/committee.css';
import '@/styles/news.css';
import '@/styles/contact.css';
import '@/styles/footer.css';

export const metadata = {
  title: { default: site.title, template: `%s | ${site.title}` },
  description: site.description,
};

export const viewport = { width: 'device-width', initialScale: 1 };

const FONTS = 'https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Noto+Sans+Thai:wght@400..700&family=Noto+Sans+Myanmar:wght@400..700&family=Noto+Sans+Lao:wght@400..700&display=swap';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href={FONTS} rel="stylesheet" />
      </head>
      <body>
        <noscript><style>{'.reveal,.reveal .item{opacity:1!important;transform:none!important}'}</style></noscript>
        <LangProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
