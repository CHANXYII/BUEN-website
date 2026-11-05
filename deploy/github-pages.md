# Deploy on GitHub Pages (current)

One-time setup:
1. Push this repo to GitHub.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

After that, every push to `main` builds and publishes automatically
(see `.github/workflows/pages.yml`). Site URL: `https://<user-or-org>.github.io/BUEN-website/`.

The site lives under `/BUEN-website/`, so CI must build with `BASE_PATH=/BUEN-website npm run build` and publish `out/`.

Local check: `npm run preview` (builds, then serves `out/`).
