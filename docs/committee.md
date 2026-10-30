# Engineering Student Committee

- Markup: `src/sections/committee.html`
- Style: `src/styles/committee.css` (what-is block, role loop, banner and member cards are shared from `ambassador.css`)
- Script: `app/sections/committee.js`

Placed right after BUEN Ambassador and built like it, but with only a president and committee members (no advisor, generations or gallery). Three blocks, each reveals on scroll:

1. **What is the Student Committee ?** heading, quote and an endless row of roles. Add a role: copy one `<li class="role">`.
2. **President**: the animated banner, one `<article class="slide">`. Use a cut-out PNG (transparent background, 3:4) in place of the avatar `<svg>`.
3. **Our committee**: grid of members. Copy one `<article class="person">` per member and set `.position`. Swap the avatar `<svg>` for an `<img>` once photos exist.

The president and members are **placeholders** ("Student Name"). Remove the `.sub` note in block 3 once the real names are in. Each string needs its translation in every `app/i18n/*.js`.
