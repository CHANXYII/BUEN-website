# BUEN Judge Scoring

Judge scoring app for the **School of Engineering, Bangkok University** competition. [Next.js](https://nextjs.org) (App Router) running as a Node server.

- **Login:** judges sign in with a name + password. Sessions are a signed, HTTP-only cookie (12 h).
- **Participants:** `/` lists everyone with your score, how many judges scored them, and the average.
- **Score board:** click a participant (`/p/BUEN01`) to enter your score per criterion and see every judge's scores + the average.

## Setup

Needs [Node.js](https://nodejs.org) 20+. Run `npm install` once, then create `.env.local`:

```bash
JUDGES=alice:secret1,bob:secret2      # name:password, comma-separated. Remove a name to revoke that judge.
SESSION_SECRET=<long random string>   # e.g. node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

```bash
npm run dev               # http://localhost:3000
npm run build && npm start  # production (cookie is HTTPS-only in production: serve behind HTTPS)
```

## Data

- `judging.json`: page title + scoring criteria (`{ "id", "name", "max" }`). Never rename an `id` after scoring starts.
- `docs/participants/BUENxx.json`: one file per participant (`id`, `name`, `major`). Optional photo: `public/photos/BUENxx.jpg`. See [docs/participants.md](docs/participants.md).
- `data/scores.json`: saved scores, written by the app (git-ignored). **Back it up**; it is the only copy.

## Structure

```
app/lib.js        config, participants, judge auth, score storage
app/actions.js    login / logout / save (server actions)
app/page.jsx      participant list
app/p/[id]/       score board for one participant
app/login/        login page
app/judge.css     styles (on top of src/styles/base.css)
```

## Deploy

Needs a Node host (a VM, Render, Railway, ...), not GitHub Pages: login and saving scores run on the server. The disk must be persistent so `data/scores.json` survives restarts.
