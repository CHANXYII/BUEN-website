# Deploy on GitHub Pages: https://chanxyii.github.io

GitHub serves `https://<account>.github.io` from a **public** repo named exactly `<account>.github.io`.
Our repo: `CHANXYII/chanxyii.github.io`.

## One-time setup

1. Rename the repo: **Settings → General → Repository name** → `chanxyii.github.io`.
2. Make it public: **Settings → General → Danger Zone → Change visibility → Public**.
3. Turn on Pages: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Point your local clone at the new name:
   ```bash
   git remote set-url origin https://github.com/CHANXYII/chanxyii.github.io.git
   ```
5. Push to `main`. After ~1 minute the site is live at **https://chanxyii.github.io**.

## After that

Every push to `main` builds and publishes automatically ([../.github/workflows/pages.yml](../.github/workflows/pages.yml)).
Progress and errors: the repo's **Actions** tab.

Moving to an org later (e.g. `buen-ambassador.github.io`): transfer the repo to the org and rename it to `<org>.github.io`.

The workflow reads the Pages address and sets `BASE_PATH`, so the site works both at `https://chanxyii.github.io/BUEN-website/` (before the rename) and at `https://chanxyii.github.io` (after).

Local check: `npm run preview` (builds, then serves `out/`).
