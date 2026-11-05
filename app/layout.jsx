import '../src/styles/base.css';
import './judge.css';

export const metadata = {
  title: 'Judge scoring | School of Engineering, Bangkok University',
  description: 'Judge scoring for the School of Engineering, Bangkok University competition.',
  icons: { icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23b3122e'/%3E%3C/svg%3E" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Noto+Sans+Thai:wght@400..700&family=Noto+Sans+Myanmar:wght@400..700&family=Noto+Sans+Lao:wght@400..700&display=swap" rel="stylesheet" />
      </head>
      <body><div className="glow" aria-hidden="true" />{children}<footer className="lb-foot wrap">&copy; School of Engineering, Bangkok University</footer></body>
    </html>
  );
}
