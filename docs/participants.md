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
  "step": 0.5,
  "workshops": [
    { "id": "w1", "name": "Workshop 1" }
  ],
  "criteria": [
    { "id": "idea", "name": "Idea", "max": 5, "desc": "Is the idea new and useful?" }
  ]
}
```

| Field | Meaning |
|---|---|
| `step` | Score buttons go up in this step: 0.5 gives 0, 0.5, 1 ... max. A criterion can set its own `step` |
| `workshops` | Judges pick one on the participant list; each workshop is scored separately |
| `criteria[].desc` | Optional one-line hint shown under the criterion name |

Never change an `id` after scoring starts. Judges tap one value per criterion (the server rounds to the step and clamps to 0..max) and can add a comment. The total is the sum of the criteria. A judge sees the other judges' scores, comments and the average only after submitting their own.

## Profile photo

Optional: `public/photos/BUEN01.jpg` (`.jpg`, `.jpeg`, `.png` or `.webp`, ~300x300 px). No photo shows a round placeholder with the number.

## Banner cut-out

Optional: `public/banners/BUEN01.png` (or `.webp`), shown in the banner at the top of the score page. Use a cut-out with a transparent background, about 3:4, with the figure touching the bottom edge; the head rises above the banner. Export at ~900x1200 px so the page stays light. Without one, the banner shows the profile photo (or the placeholder) in a frame instead.

## Privacy

Participant files are in the repo. Use the display name the participant agreed to; don't commit student IDs, emails or phone numbers.
