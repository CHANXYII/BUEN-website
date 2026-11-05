# BUEN Leaderboard

Competition leaderboard of the **School of Engineering, Bangkok University**. One page built with [Next.js](https://nextjs.org) (App Router) and exported as static HTML. Results are read from JSON at build time.

- **Theme:** black background with crimson, white and gold. Font: Google Sans (Noto Sans Thai for Thai).
- **Languages:** 12, from hardcoded dictionaries in `app/i18n/*.js` (English text is the key; add a line to each file to translate a new word).
- **Hosting:** GitHub Pages, own domain/site separate from the main website.

## Update the results

Edit the participant files in `docs/participants/` (`BUEN01.json` ... `BUEN25.json`) and push to `main`. Format and rules: [docs/participants.md](docs/participants.md).

## Run on localhost

Needs [Node.js](https://nodejs.org) 20+. Run `npm install` once.

```bash
npm run dev       # live reload on http://localhost:3000
npm run build     # static export to out/
npm run preview   # build, then serve out/
```

## Structure

```
app/           layout.jsx, page.jsx (reads + ranks data at build), Leaderboard.jsx (UI), leaderboard.css, i18n/
leaderboard/data.json   title + workshop list
src/styles/base.css   shared colours and typography
public/        static files (photos/, CNAME) copied into out/
deploy/        hosting notes (github-pages.md, custom-domain.md)
docs/          participant data guide + participants/BUENxx.json
.github/workflows/pages.yml   auto-deploy on push to main
```

## Deploy

Pushing to `main` publishes to GitHub Pages. One-time setup: repo **Settings → Pages → Source: GitHub Actions**. Custom domain: [deploy/custom-domain.md](deploy/custom-domain.md).
