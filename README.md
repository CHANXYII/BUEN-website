# BUEN-website

Website of the **School of Engineering, Bangkok University**.
A single-page static site: plain HTML, CSS and JavaScript, no framework and no dependencies. Node.js is only used to assemble the files.

- **Theme:** black background with crimson, white and gold.
- **Font:** Google Sans (Google Fonts) with Noto Sans Thai for Thai.
- **Hosting:** GitHub Pages (https://chanxyii.github.io) now, custom domain later.

## Run on localhost

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm run preview
```

This builds the site and serves it at **http://localhost:3500** (the exact address is printed in the terminal). The first run downloads the `serve` helper through `npx`.

There is no live reload. After editing a file in `src/` or `app/`, stop the server (Ctrl+C) and run `npm run preview` again.

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Builds the site into `deploy/site/` |
| `npm run preview` | Builds, then serves `deploy/site/` on localhost |

If you don't want `npx`, run `npm run build` and then `python -m http.server 8000 -d deploy/site`, and open http://localhost:8000.

## Project structure

```
BUEN-website/
├── src/                 Content and design
│   ├── index.html       Page shell
│   ├── sections/        One HTML file per section
│   ├── styles/          base.css + one CSS file per section
│   └── assets/          Images (hero.png, news/)
├── app/                 Build and behaviour
│   ├── build.mjs        Joins src/ and app/ into deploy/site/
│   ├── lib.js           Shared helpers ($, $$, reveal)
│   └── sections/        One JS file per section
├── deploy/              Hosting
│   ├── site/            Build output (git-ignored)
│   ├── github-pages.md  Current hosting steps
│   ├── custom-domain.md Moving to our own domain
│   └── CNAME.example    Copy to CNAME when the domain is ready
├── docs/                Guide for each section
└── .github/workflows/pages.yml   Auto-deploy to GitHub Pages
```

## Sections

Header, Hero (featured BU news), BUEN Ambassador, Student Committee, News, Contact, Footer.
Each section has the same three files (`src/sections/<name>.html`, `src/styles/<name>.css`, `app/sections/<name>.js`) and a guide in `docs/<name>.md`. See [docs/README.md](docs/README.md).

**Add a section:** create the three files, add its name to the list in `app/build.mjs`, and add a link in `src/sections/header.html`.

## Deploy

Pushing to `main` builds and publishes to GitHub Pages automatically.
One-time setup: repo **Settings → Pages → Source: GitHub Actions**.
The site is at `https://chanxyii.github.io` (repo `CHANXYII/chanxyii.github.io`).
Details: [deploy/github-pages.md](deploy/github-pages.md). When we have a domain: [deploy/custom-domain.md](deploy/custom-domain.md).

## Font

Google Sans and Noto Sans Thai are loaded from Google Fonts in `src/index.html` (needs an internet connection). Font stack: `src/styles/base.css`. Thai, Chinese, Japanese and Korean fall back to Noto Sans Thai / system fonts.

## Content status

Hero news, ambassadors, committee, news, email, address and the Apply now link are **placeholders** marked `TODO`. Replace them with official information before launch.
