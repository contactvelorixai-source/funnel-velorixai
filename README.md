# VelorixAI Funnel

Live site files for **VelorixAI**. Static HTML, CSS and vanilla JavaScript. No build step.

## Files

| File | What it is |
|---|---|
| `index.html` | The live site (light theme, neon accent). Open this first. |
| `terms.html` `privacy.html` `refund.html` | Policy pages, linked from the footer |
| `velorixai-website.html` | Earlier dark-theme version, kept for reference |
| `velorixai-styles.css` | Stylesheet for `velorixai-website.html` only |
| `velorixai-script.js` | Script for `velorixai-website.html` only |
| `velorixai-appready.js` | Paste into AppReady's Custom JavaScript field |
| `assets/velorix-logo.png` | Logo |
| `EDITING-GUIDE.md` | How to edit the site without a developer |

`index.html` is self-contained: its CSS and JavaScript are inside the file.

## Publishing with GitHub Pages

Settings, then Pages, then Branch: `main` / root. The site goes live at
`https://<user>.github.io/<repo>`.

## Editing

Open `index.html`, find the **SITE SETTINGS** block near the bottom of the file,
and change the values there: booking URL, WhatsApp number, contact details.
See `EDITING-GUIDE.md` for the full walkthrough.

## Brand

| Token | Value |
|---|---|
| Accent | `#A9D622` |
| Ink | `#0F172A` |
| Hairline | `#E2E8F0` |
| Section tint | `#F8FAFC` |
| Type | Montserrat (headings), Plus Jakarta Sans (body) |
