# Participant data

Results are plain JSON files. Edit them, push to `main`, and the site rebuilds and publishes.

Ranking = **sum of each participant's workshop points**. After each workshop, add its points; the page does the maths and the sorting.

## Files

- `leaderboard/data.json`: page title and the workshop list (the columns).
- `docs/participants/BUEN01.json` ... `BUEN25.json`: **one file per participant**. The build merges them, so editing one person never touches the others.

`leaderboard/data.json`:

```json
{
  "kicker": "Competition",
  "title": "Leaderboard",
  "updated": "28 Oct 2026",
  "countdown": { "label": "Final round", "to": "2026-11-30T17:00:00+07:00" },
  "workshops": [
    { "id": "w1", "name": "Workshop 1" },
    { "id": "w2", "name": "Workshop 2" }
  ]
}
```

`docs/participants/BUEN01.json`:

```json
{ "id": "BUEN01", "name": "Somchai J.", "major": "Computer Engineering", "points": { "w1": 20, "w2": 15, "w3": 18, "w4": 22 } }
```

| Field | Required | Meaning |
|---|---|---|
| `kicker` | yes | Small gold label above the title |
| `title` | yes | Page headline |
| `updated` | no | Free text shown as "Updated ...". `""` hides it |
| `countdown.to` | no | Countdown target, ISO date **with timezone** (`+07:00` = Bangkok). Remove `countdown` to hide the clock. Shows "Time's up" once passed |
| `countdown.label` | no | Small label above the clock |
| `workshops[].id` | yes | Short unique key (`w1`, `w2`, ...). Used in `points`. Never rename after points are entered |
| `workshops[].name` | yes | Column heading |
| `id` | yes | `BUEN01`-`BUEN25`. **Must equal the file name** (the build fails otherwise) |
| `name` | yes | Display name |
| `major` | no | Shown under the name (hidden if empty) |
| `points` | yes | `{ "<workshop id>": number }`. A missing workshop shows "-" and counts as 0 |

## Profile photo

Optional. Put a square-ish photo at `public/photos/BUEN01.jpg` (`.jpg`, `.jpeg`, `.png` or `.webp`, the file name = the ID, ~300x300 px, under 200 KB). No photo shows a round placeholder with the number. Photos are public: get the participant's consent.

## Add a workshop

1. Add `{ "id": "w5", "name": "..." }` to `workshops` in `leaderboard/data.json` (a new column appears).
2. Add `"w5": <points>` to each participant file.

## Podium

The top 3 are shown on a podium (2nd, 1st, 3rd) above the table, with their total and workshop points. The table starts at rank 4.

## Fast-track

Automatic: **exactly one per workshop**, the participant with the highest points in it. They get a gold lightning-bolt badge after their name, numbered by workshop (⚡1 = Workshop 1, ...). If two people tie, the one with the better overall rank gets it. 0 points never earns it, and a person can hold several. It is display only and does not change the total. Nothing to enter.

## Elimination

The top 16 are finalists. Rank 17 and below is eliminated: those rows are greyed out and sit under a dashed red **Eliminated** line. Ranks are unique, so exactly 16 people stay in. The cut is `CUT = 16` in `app/Leaderboard.jsx`.

## Rules

- **Order doesn't matter.** The page sorts by total, highest first. Don't write ranks or totals.
- **Ranks are unique** (1 to 25, never shared). Equal totals are split by the **latest workshop's points** (then the one before, ...); if still equal, by the lower ID.
- Points are **numbers**, not text (`20`, not `"20"`).
- Strict JSON: double quotes, commas between items, no comma after the last item, no comments. Save as UTF-8 (Thai is fine).
- Text is escaped, and names are never translated.

## Privacy

The file is public. Use the display name the participant agreed to (first name + initial, or a nickname). Don't commit student IDs, emails or phone numbers. Collect those elsewhere.

## Before you push

1. Valid JSON: run `npm run build`. It stops with the file name if a JSON file is broken or an ID does not match.
2. Preview: `npm run dev` (live reload) and check the table.
3. Replace the sample names and points with real data.
