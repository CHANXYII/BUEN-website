# Ambassador profile page

- Content: the members in `content/ambassador.js`; links built in `lib/profiles.js`
- Component: `components/ProfileDialog.jsx`; route `app/[slug]/page.js`
- Style: `styles/ambassador-profile.css` (reuses the banner and gallery styles from `ambassador.css`)

A full-screen dialog over the home page with no nav entry: it opens by clicking (or pressing Enter on) an ambassador card. Hovering a card shows "Show more".

**Links:** each ambassador gets their own URL, the first name in lower case: `/joannes/`, `/thanakrit/`, `/oangkhana/`, `/naruechaya/`, `/surayut/`, `/chanunya/`. The build makes one page per member, so the link can be shared and opened directly (with the ambassador's name in the tab title). Browser back/forward work. Two ambassadors with the same first name would share a link, so keep first names unique.

There is nothing to edit here when adding an ambassador. The page shows:

- **Banner**: the card photo, full name, major, then "BUEN Ambassador: The [n] Generation", the member's `positions` and `profileOnly`.
- **Our work**: that generation's `gallery`.
