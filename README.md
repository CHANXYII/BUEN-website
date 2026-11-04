# BUEN-website

Website of the **School of Engineering, Bangkok University**.
A one-page site built with [Next.js](https://nextjs.org) (React), exported as static HTML and served with nginx in Docker or on GitHub Pages.

- **Theme:** black background with crimson, white and gold.
- **Font:** Google Sans (Google Fonts), DB Adman X for Thai letters.
- **Languages:** 12, switchable in the header ([docs/i18n.md](docs/i18n.md)).

## Run on localhost

Requires [Node.js](https://nodejs.org) 20.9 or newer.

```bash
npm install      # first time only
npm run dev      # http://localhost:3500, reloads as you edit
```

Or with Docker only (no Node needed): `docker compose up --build`, then open http://localhost:8080.

| Command | What it does |
|---|---|
| `npm run dev` | Development server with live reload on http://localhost:3500 |
| `npm run build` | Builds the static site into `out/` |
| `npm run preview` | Builds, then serves `out/` on http://localhost:3500 |
| `docker compose up --build` | Builds the production image and serves it on http://localhost:8080 |

## Where to edit

Most changes are text, people or photos, and need **only `content/`**:

| To change | Edit |
|---|---|
| Hero slides | `content/hero.js` |
| Ambassadors, advisor, presidents, videos, galleries | `content/ambassador.js` |
| Committee members, years, galleries, social links | `content/committee.js` |
| News | `content/news.js` |
| Nav links, contact email/address, Apply link | `content/site.js` |
| Translations | `i18n/<code>.js` (keyed by the English text) |
| Photos | `public/assets/` (paths in `content/` start with `/assets/...`) |

## Project structure

```
BUEN-website/
├── content/        Text, people, links and photo paths (edit here)
├── components/     One React component per section, plus shared pieces (ui.jsx)
├── app/            Next.js routes: layout.js (page shell), page.js (home), [slug]/ (profile links), icon.png
├── styles/         base.css + one CSS file per section, fonts/
├── i18n/           index.js (language list) + one dictionary per language
├── lib/            Small helpers (asset paths, profile links)
├── public/assets/  Images
├── docs/           Guide for each section
├── deploy/         Hosting notes
├── Dockerfile, nginx.conf, compose.yml   Docker image
└── .github/workflows/pages.yml           Auto-deploy to GitHub Pages
```

See [docs/README.md](docs/README.md) for each section.

## Deploy

- **GitHub Pages:** pushing to `main` builds and publishes automatically. One-time setup: repo **Settings → Pages → Source: GitHub Actions**. Details: [deploy/github-pages.md](deploy/github-pages.md).
- **Docker** (Render, a VPS, any Docker host): [deploy/docker.md](deploy/docker.md).

## Content status

Hero news, news items, the contact email/address and gallery photos are **placeholders** marked `TODO`. Replace them with official information before launch.
