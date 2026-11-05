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

## Privacy

Participant files are in the repo. Use the display name the participant agreed to; don't commit student IDs, emails or phone numbers.
