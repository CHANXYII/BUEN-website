# POC / demo deploy (Docker)

The image builds the site (`npm run build`) and serves `deploy/site/` with nginx.
Files: [docker/Dockerfile](docker/Dockerfile), [docker/nginx.conf](docker/nginx.conf), [docker/compose.yml](docker/compose.yml).

## Run locally

```bash
docker compose -f deploy/docker/compose.yml up --build -d   # http://localhost:8080
docker compose -f deploy/docker/compose.yml down            # stop
```

Without compose:

```bash
docker build -f deploy/docker/Dockerfile -t buen-poc .
docker run --rm -p 8080:80 buen-poc
```

## Put it online (not localhost)

### Option A – Render (free, recommended for a demo)

Uses [../render.yaml](../render.yaml). Result: `https://buen-poc.onrender.com`.

1. Push this repo to GitHub.
2. Sign in at https://render.com with GitHub.
3. **New → Blueprint**, pick `BUEN-website`, click **Apply**.
4. Wait for the build (~2 min). Every push to `main` redeploys.

Free plan sleeps after ~15 min idle; the first visit after that takes ~30 s to wake.
Custom address later: Render service → **Settings → Custom Domains** → add `poc.<your-domain>`, then a `CNAME` record to `buen-poc.onrender.com`.

### Option B – Your own server (VPS / university server)

On a Linux machine with Docker installed:

```bash
git clone https://github.com/CHANXYII/BUEN-website.git && cd BUEN-website
docker compose -f deploy/docker/compose.yml up --build -d    # http://<server-ip>:8080
```

Update: `git pull && docker compose -f deploy/docker/compose.yml up --build -d`.
For HTTPS and a domain, put Caddy or nginx with Let's Encrypt in front of port 8080.

### Option C – Other Docker hosts

Fly.io, Railway, Google Cloud Run: Dockerfile `deploy/docker/Dockerfile`, build context repo root, port `80`.

## About the `*.github.io` address

GitHub Pages does not run Docker, and it only serves `https://<account>.github.io`.
Account names cannot contain dots, so `poc.buen.ambassador.github.io` is not possible. Closest options:

| URL | How |
|---|---|
| `https://chanxyii.github.io/BUEN-website/` | Current repo on GitHub Pages ([github-pages.md](github-pages.md)) |
| `https://buen-ambassador.github.io/` | Create a GitHub org `buen-ambassador`, repo `buen-ambassador.github.io` |
| `https://buen-ambassador.github.io/poc/` | Same org, repo named `poc` |