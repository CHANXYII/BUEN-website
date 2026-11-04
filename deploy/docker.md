# Deploy with Docker

The image builds the site (`npm run build`, Next.js static export) and serves `out/` with nginx.
Files at the repo root: [Dockerfile](../Dockerfile), [nginx.conf](../nginx.conf), [compose.yml](../compose.yml).

## Run locally

```bash
docker compose up --build -d   # http://localhost:8080
docker compose down            # stop
```

Without compose:

```bash
docker build -t buen-website .
docker run --rm -p 8080:80 buen-website
```

Development inside Docker (live reload, no Node on your machine): `docker compose --profile dev up dev`, then open http://localhost:3500.

Serving under a sub-path (e.g. `https://example.com/buen/`): `docker build --build-arg BASE_PATH=/buen -t buen-website .`

## Put it online

### Option A – Render (free, good for a demo)

Uses [../render.yaml](../render.yaml). Result: `https://buen-poc.onrender.com`.

1. Push this repo to GitHub.
2. Sign in at https://render.com with GitHub.
3. **New → Blueprint**, pick `BUEN-website`, click **Apply**.
4. Wait for the build (~3 min). Every push to `main` redeploys.

The free plan sleeps after ~15 min idle; the first visit after that takes ~30 s to wake.
Custom address later: Render service → **Settings → Custom Domains** → add `poc.<your-domain>`, then a `CNAME` record to `buen-poc.onrender.com`.

### Option B – Your own server (VPS / university server)

On a Linux machine with Docker installed:

```bash
git clone https://github.com/CHANXYII/BUEN-website.git && cd BUEN-website
docker compose up --build -d    # http://<server-ip>:8080
```

Update: `git pull && docker compose up --build -d`.
For HTTPS and a domain, put Caddy or nginx with Let's Encrypt in front of port 8080.

### Option C – Other Docker hosts

Fly.io, Railway, Google Cloud Run: Dockerfile at the repo root, build context the repo root, port `80`.

## About the `*.github.io` address

GitHub Pages does not run Docker, and it only serves `https://<account>.github.io`.
Account names cannot contain dots, so `poc.buen.ambassador.github.io` is not possible. Closest options:

| URL | How |
|---|---|
| `https://chanxyii.github.io/BUEN-website/` | Current repo on GitHub Pages ([github-pages.md](github-pages.md)) |
| `https://buen-ambassador.github.io/` | Create a GitHub org `buen-ambassador`, repo `buen-ambassador.github.io` |
| `https://buen-ambassador.github.io/poc/` | Same org, repo named `poc` |
