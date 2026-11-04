# BUEN Ambassador (main section)

- Content: `content/ambassador.js`
- Component: `components/Ambassador.jsx` (+ `VideoPlaylist.jsx`, `PresidentSlider.jsx`, `RolesLoop.jsx`)
- Style: `styles/ambassador.css` (card, banner and gallery styles are shared with the Committee section)

Placed first after the hero. Every block fades in on scroll:

1. **About Us video**: `videos` is a list of YouTube IDs, played as a looping playlist. Arrows or a video ending jump to the next one. Autoplays muted 2 s after scrolling into view (not with reduced motion); clicking plays with sound. Empty list = "Video coming soon". The text under it is `intro`.
2. **Student Activities** divider.
3. **What is BUEN Ambassador ?** `what`: heading, quote and the endless row of `roles` (add a role: add a string).
4. **Advisor** banner: `advisor`. Photo: cut-out PNG (transparent background, 3:4).
5. **Presidents** slideshow: one entry per president in `presidents` (autoplay 5 s, pauses on hover, arrows, dots, swipe). With one president the arrows and dots hide.
6. **Ambassadors by generation**: `generations`, newest first (the first shows by default). Each generation has `members` and a `gallery`.
   - **Add an ambassador:** add `{ photo, name, major, year }` to their generation. `positions` show on the card and profile; `profileOnly` only on the profile. Use the majors from `content/majors.js`.
   - **Add a generation:** add a new entry at the top with the next `gen` number.
   - Clicking a card opens the profile page: see [ambassador-profile.md](ambassador-profile.md).
7. **Our work** gallery: follows the generation tabs. `{ src: '/assets/gallery/gen2-1.jpg', alt: '...', caption: 'Event name' }`; the first photo shows large; `{}` (or `placeholders(n)`) is a "Photo coming soon" tile.
8. Social buttons: `links` (`icon`: instagram, youtube, email, facebook, tiktok).

New English text needs its translation in every `i18n/*.js`.
