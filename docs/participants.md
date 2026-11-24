# Participant data

One JSON file per participant in `docs/participants/` (`BUEN01.json` ... `BUEN25.json`). Judges see them in file-name order.

```json
{ "id": "BUEN01", "name": "Somchai J.", "major": "Computer Engineering" }
```

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Must equal the file name. Scores are stored under it, so never rename after scoring starts |
| `name` | yes | Display name |
| `major` | no | Shown under the name |

Old `points` fields from the leaderboard are ignored.

## Scoring criteria

In `judging.json`:

```json
{
  "title": "Judge scoring",
  "criteria": [
    { "id": "idea", "name": "Idea", "max": 10 }
  ]
}
```

Each judge enters 0 to `max` per criterion (the server clamps out-of-range values). Total = sum of criteria; the score board shows each judge's total and the average across judges.

## Profile photo

Optional: `public/photos/BUEN01.jpg` (`.jpg`, `.jpeg`, `.png` or `.webp`, ~300x300 px). No photo shows a round placeholder with the number.

## Banner cut-out

Optional: `public/banners/BUEN01.png` (or `.webp`), shown in the banner at the top of the score page. Use a cut-out with a transparent background, about 3:4, with the figure touching the bottom edge; the head rises above the banner. Export at ~900x1200 px so the page stays light. Without one, the banner shows the profile photo (or the placeholder) in a frame instead.

## Privacy

Participant files are in the repo. Use the display name the participant agreed to; don't commit student IDs, emails or phone numbers.
