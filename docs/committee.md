# Engineering Student Committee (STAFFBUEN)

- Content: `content/committee.js`
- Component: `components/Committee.jsx`
- Style: `styles/committee.css` (what-is block, role loop, banner and member cards are shared from `ambassador.css`)

Placed right after BUEN Ambassador and built like it. Every block fades in on scroll:

1. **What is STAFFBUEN ?** `what`: heading, quote and the endless row of `roles`.
2. **Academic years**: `years`, newest first. The year tabs appear by themselves once there are two. **Add a year:** copy the whole year entry to the top and change `year`.
3. **President** banner: `president` of that year. Add `photo` (cut-out PNG, transparent background, 3:4) to replace the silhouette.
4. **Groups**: the tabs above the members (Committee, Cheerleader & Katakorn). Each group has `members` (`{ photo, name, positions, major, year }`; no `photo` = silhouette), an optional `gallery` (first photo large, `{}` = "Photo coming soon") and its own social `links`. The open group tab is kept when switching year.
