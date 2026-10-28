# BUEN Leaderboard

Competition leaderboard of the **School of Engineering, Bangkok University**. One static page: plain HTML, CSS and JavaScript, no framework, no dependencies. Node.js is only used to assemble the files.

- **Theme:** black background with crimson, white and gold. Font: Google Sans (Noto Sans Thai for Thai).
- **Languages:** 12, from hardcoded dictionaries in `app/i18n/` (English text is the key; add a line to each file to translate a new word).
- **Hosting:** GitHub Pages, own domain/site separate from the main website.

## Update the results

Edit the participant files in `docs/participants/` (`BUEN01.json` ... `BUEN25.json`) and push to `main`. Format and rules: [docs/participants.md](docs/participants.md).

## Run on localhost

Needs [Node.js](https://nodejs.org) 18+.

```bash
npm run preview   # build, then serve deploy/site
npm run build     # build only
```

No live reload: rebuild after editing.

## Structure

```
leaderboard/   index.html, leaderboard.css, leaderboard.js, data.json
src/styles/base.css   shared colours and typography
app/build.mjs  builds into deploy/site/
deploy/        hosting notes (github-pages.md, custom-domain.md)
docs/          participant data guide + participants/BUENxx.json
.github/workflows/pages.yml   auto-deploy on push to main
```

## Deploy

Pushing to `main` publishes to GitHub Pages. One-time setup: repo **Settings → Pages → Source: GitHub Actions**. Custom domain: [deploy/custom-domain.md](deploy/custom-domain.md).
