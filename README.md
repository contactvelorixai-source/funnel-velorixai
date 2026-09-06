# VelorixAI Site

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies to install.

## Files

| File | What it is |
|---|---|
| `index.html` | The live site. Self-contained: CSS and JS are inside the file. |
| `terms.html` `privacy.html` `refund.html` | Policy pages linked from the footer |
| `velorixai-appdaddy-site.js` | Paste into AppDaddy's Custom JavaScript field to render this whole site |
| `velorixai-appready.js` | Paste into AppReady's Custom JavaScript field to enhance an existing AppReady page |
| `velorixai-website.html` + `velorixai-styles.css` + `velorixai-script.js` | Earlier dark-theme version, kept for reference |
| `assets/velorix-logo.png` | Logo |
| `EDITING-GUIDE.md` | How to edit the site without a developer |

Use **one** of the two platform scripts, not both. `velorixai-appdaddy-site.js`
builds the page itself; `velorixai-appready.js` assumes the content already
exists in the page builder and only adds the persistent CTA, the scroll-offset
fix and the animations.

## Publishing with GitHub Pages

Settings, then Pages, then Branch `main` / root. The site goes live at
`https://<user>.github.io/<repo>`.

## Editing

Open `index.html` and find the **SITE SETTINGS** object near the bottom of the
file: booking URL, WhatsApp number and contact details all live there.
`EDITING-GUIDE.md` has the full walkthrough.

## Persistent CTA

A fixed "Book My Free Demo" button stays visible on every section at every screen
size. It is bottom-right on desktop and full-width at the bottom on mobile, with
`env(safe-area-inset-bottom)` respected. The body carries matching bottom padding
so the button never covers the last lines of a section, and it fades only while a
dialog is open.

## Brand

| Token | Value |
|---|---|
| Accent | `#A9D622` |
| Ink | `#0F172A` |
| Hairline | `#E2E8F0` |
| Section tint | `#F8FAFC` |
| Type | Montserrat (headings), Plus Jakarta Sans (body) |
