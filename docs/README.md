# docs

How the site is built and how to edit each section.

Structure: every section has the same three files:

| Section | Markup | Style | Behaviour | Guide |
|---|---|---|---|---|
| Header | `src/sections/header.html` | `src/styles/header.css` | `app/sections/header.js` | [header.md](header.md) |
| Hero | `src/sections/hero.html` | `src/styles/hero.css` | `app/sections/hero.js` | [hero.md](hero.md) |
| Ambassador | `src/sections/ambassador.html` | `src/styles/ambassador.css` | `app/sections/ambassador.js` | [ambassador.md](ambassador.md) |
| Ambassador profile | `src/sections/ambassador-profile.html` | `src/styles/ambassador-profile.css` | `app/sections/ambassador-profile.js` | [ambassador-profile.md](ambassador-profile.md) |
| Committee | `src/sections/committee.html` | `src/styles/committee.css` | `app/sections/committee.js` | [committee.md](committee.md) |
| News | `src/sections/news.html` | `src/styles/news.css` | `app/sections/news.js` | [news.md](news.md) |
| Contact | `src/sections/contact.html` | `src/styles/contact.css` | `app/sections/contact.js` | [contact.md](contact.md) |
| Footer | `src/sections/footer.html` | `src/styles/footer.css` | `app/sections/footer.js` | [footer.md](footer.md) |

- `src/` – content, styles, `index.html` shell, `assets/` (images)
- `app/` – `build.mjs` (joins everything into `deploy/site/`), `lib.js` (helpers), per-section scripts
- `deploy/` – hosting docs and build output
- Needs Node 18+. No dependencies. `npm run build` / `npm run preview`.
- Languages: see [i18n.md](i18n.md)

**Add a section:** create the three files, add the name to the list in `app/build.mjs`, add a nav link in `header.html`.

**Content status:** ambassadors, committee, news, email and address are **placeholders** (marked `TODO`). Replace with official info before launch.
