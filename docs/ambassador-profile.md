# Ambassador profile page

- Markup: `src/sections/ambassador-profile.html`
- Style: `src/styles/ambassador-profile.css` (reuses the president `.banner` and work `.gallery` styles from `ambassador.css`)
- Script: `app/sections/ambassador-profile.js`

A full-screen `<dialog>` with no nav entry: it opens by clicking (or pressing Enter on) an ambassador card in **Ambassadors by generation**. Hovering a card shows "Show more".

**Links:** each profile gets its own URL, the first name in lower case: `site/joannes`, `site/thanakrit`, `site/oangkhana`, `site/naruechaya`, `site/surayut`, `site/chanunya`. Opening that link directly shows the profile; browser back/forward work. Two ambassadors with the same first name would share a link, so change one card if that happens. The build writes `404.html` (a copy of `index.html`) so GitHub Pages serves these links; nginx already falls back to `index.html`.

Everything on it is filled from the clicked card, so there is nothing to edit here when adding an ambassador:

- **Banner**: card photo (framed like the card), full name on one line, major, then a list: "BUEN Ambassador: The [n] Generation" (from the card's generation tab) and every `<p class="position">` on the card.
- **Profile-only positions**: mark them `<p class="position" hidden>` on the card. Without `hidden` they show on the card too.
- **Our work**: scrolling down shows that generation's photos, copied from **Our work by generation** (`#amb-work`).

Back button or Esc closes it.
