# Design notes

Modern, editorial look: black base, white type, hairline dividers, crimson and gold used sparingly. No solid colour fills: tints are translucent (`--crimson-a`, `--gold-a`, `--glass`), all defined in `src/styles/base.css`.

- **Type-led:** big headlines, small gold uppercase labels, sections numbered automatically (01, 02, ...) by CSS counters.
- **Lines, not boxes:** sections, lists and tabs are separated by 1px hairlines.
- **Shapes:** 4px corners, rectangular buttons with an arrow, portrait (4:5) photo placeholders.
- **Motion:** fade-up on scroll, crossfading hero slides, subtle row hovers. Everything stops for visitors who ask for reduced motion.
