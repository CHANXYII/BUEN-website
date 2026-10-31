# Engineering Student Committee

- Markup: `src/sections/committee.html`
- Style: `src/styles/committee.css` (what-is block, role loop, banner and member cards are shared from `ambassador.css`)
- Script: `app/sections/committee.js`

Placed right after BUEN Ambassador and built like it, but with only a president and committee members (no advisor or generations). Four blocks, each reveals on scroll:

1. **What is the Student Committee ?** heading, quote and an endless row of roles. Add a role: copy one `<li class="role">`.
2. **President**: the animated banner, one `<article class="slide">`. Use a cut-out PNG (transparent background, 3:4) in place of the avatar `<svg>`.
3. **Members**: Committee and Cheerleader & Katakorn tabs (`data-gen` on the button and its `.gen-panel`). Copy one `<article class="person">` per member and set `.position`. Swap the avatar `<svg>` for an `<img>` once photos exist.

4. **Gallery**: activity photos, shown on the Committee tab only (no gallery for Cheerleader & Katakorn). Put photos in `src/assets/gallery/` and replace a placeholder `<figure class="shot">` (see the comment in the HTML).

**Academic years:** the president banner and members sit in one `.year-panel` per year, newest first. To add a year: add its button first in `.year-tabs`, copy the whole panel above the old one, and change its `id` and `data-gen` (`year-2027`, `2027`). The year buttons appear by themselves once there are two.

Each string needs its translation in every `app/i18n/*.js`.
