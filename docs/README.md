# docs

How the site is built and how to edit each section.

Each section has a content file (what it says), a component (how it works) and a CSS file (how it looks).
Text and people changes only need the content file.

| Section | Content | Component | Style | Guide |
|---|---|---|---|---|
| Header | `content/site.js` | `components/Header.jsx` | `styles/header.css` | [header.md](header.md) |
| Hero | `content/hero.js` | `components/Hero.jsx` | `styles/hero.css` | [hero.md](hero.md) |
| Ambassador | `content/ambassador.js` | `components/Ambassador.jsx` | `styles/ambassador.css` | [ambassador.md](ambassador.md) |
| Ambassador profile | `content/ambassador.js` | `components/ProfileDialog.jsx` | `styles/ambassador-profile.css` | [ambassador-profile.md](ambassador-profile.md) |
| Committee | `content/committee.js` | `components/Committee.jsx` | `styles/committee.css` | [committee.md](committee.md) |
| News | `content/news.js` | `components/News.jsx` | `styles/news.css` | [news.md](news.md) |
| Contact | `content/site.js` | `components/Contact.jsx` | `styles/contact.css` | [contact.md](contact.md) |
| Footer | `content/site.js` | `components/Footer.jsx` | `styles/footer.css` | [footer.md](footer.md) |

- Shared pieces (cards, banners, tabs, galleries, social buttons, icons): `components/ui.jsx`.
- Scroll fade-in: wrap a block in `<Reveal>` (`components/Reveal.jsx`).
- Page order: `components/Home.jsx`. Page shell (fonts, CSS imports): `app/layout.js`.
- Major names shared by all member lists: `content/majors.js`.
- Languages: see [i18n.md](i18n.md). Design notes: [design.md](design.md).

**Add a section:** create `components/<Name>.jsx` (wrap it in `<Reveal as="section" id="...">` to fade in), a `styles/<name>.css` imported in `app/layout.js`, add it to `components/Home.jsx`, and add a nav link in `content/site.js`.

**Add a photo:** put it in `public/assets/...` and use the path from `/assets/...` in the content file. Paths are case-sensitive on the server (`.JPG` ≠ `.jpg`).
