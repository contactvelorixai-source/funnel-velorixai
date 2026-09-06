# How to edit your Velorix AI funnel

You don't need any software. Everything is edited in your browser, on GitHub.

---

## The 30-second version

1. Go to https://github.com/contactvelorixai-source/funnel-velorixai
2. Click **index.html**
3. Click the **pencil icon** (top right) — this is edit mode
4. Change what you need
5. Scroll down → **Commit changes**
6. Wait about 1 minute. Your live site updates automatically.

That's it. Same 6 steps every time.

---

## Finding what you want to change

Inside edit mode, press **Ctrl + F** (Windows) or **Cmd + F** (Mac) and type a few words
of the text you see on your website. It will jump straight to it.

Change only the words **between** the `>` and `<` symbols.

```
<h3>16 powerful apps in one platform</h3>
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ only edit this part
```

Never delete the `<` `>` symbols themselves. If you do, that section will break.

---

## SITE SETTINGS — the most important part

Near the top of `index.html` there is a block that looks like this. Search for
**SITE SETTINGS** to find it.

Change a value here and it updates **everywhere on the site at once** — the header,
the footer, every button, and the Thank You page.

```js
brandName:   "Velorix AI",
brandFirst:  "Velorix",
brandSecond: "AI",

phone:           "+91 8218854770",
email:           "contact.velorixai@gmail.com",
whatsappNumber:  "918218854770",
whatsappMessage: "Hi! I'm interested in Velorix AI.",

CAL_ID_BOOKING_URL: "https://cal.id/velorixai/demo-call?duration=30",

youtubeUrl:   "https://youtube.com/shorts/Ol6ReFCvqeQ?feature=share",

termsUrl:   "#terms",
privacyUrl: "#privacy",
refundUrl:  "#refund",

priceRange: "₹25,900 – ₹85,900"
```

### The two rules for this block

1. Keep the **"quote marks"** around your new value.
2. Keep the **comma** at the end of the line.

```
phone:  "+91 9999999999",
        ^                ^
        keep quotes      keep comma
```

### What each setting does

| Setting | Controls |
|---|---|
| `phone` | The phone number in the footer and Thank You page |
| `email` | The email address (click-to-send works automatically) |
| `whatsappNumber` | Every WhatsApp button. Digits only, with country code, no `+` |
| `whatsappMessage` | The message pre-typed for the visitor when WhatsApp opens |
| `CAL_ID_BOOKING_URL` | Where "Book Your Demo" sends people |
| `youtubeUrl` | The demo video. Paste any normal YouTube or Shorts link |
| `termsUrl` etc. | Leave as `#terms` to use the built-in pages, or paste a full web address to link somewhere else |
| `priceRange` | The big price figure in the pricing section |

---

## Common jobs

### Change the phone number or email
SITE SETTINGS → edit `phone` or `email`. Done — it updates in every location.

### Change the demo video
SITE SETTINGS → replace the link in `youtubeUrl`. Any YouTube or Shorts link works.

### Change the booking calendar
SITE SETTINGS → replace `CAL_ID_BOOKING_URL`.

### Change the price
SITE SETTINGS → edit `priceRange`.

### Rename an app
Search for the app name. You'll find a line like this:

```
<div class="app-item"><i class="fas fa-check-circle"></i><span>Omni Chat</span></div>
```

Change only `Omni Chat`. Note: apps in both packages appear twice — search again
to catch the second one.

### Add an app to a package
Copy an entire existing app line, paste it directly underneath, and change the name.
Then update the count: search for `8 apps` or `16 apps` and correct the number
(it appears in a few places — the tab, the badge, and the intro text).

### Change a headline or paragraph
Search for the words you can see on the site, and type over them.

### Replace the logo
In the repo, open the `assets` folder → click `velorix-logo.png` → **⋯** menu → **Delete**.
Then **Add file → Upload files** and upload your new logo, named exactly
`velorix-logo.png`. Keeping the same name means nothing else needs changing.

### Edit the Thank You page
It's in the same `index.html` file. Search for **THANK YOU PAGE** and edit the text
below it as normal.

### Edit the policy pages
Search for **POLICY PAGES**. The Terms, Privacy and Refund text all live there.

---

## If something breaks

Nothing is ever lost. GitHub keeps every previous version.

1. Open `index.html` in the repo
2. Click **History** (top right)
3. Find the version from before your change
4. Click it → **⋯** → **Revert** or copy the old content back

---

## Safety rules

**Safe to edit**
- Any words you can see on your website
- Anything inside "quote marks" in SITE SETTINGS

**Do not touch**
- `<` and `>` symbols
- Anything inside `<style>` or between `class="..."` marks
- Curly brackets `{ }` and semicolons in the settings block

**Best habit:** make one change, commit, check the live site, then make the next one.
If something goes wrong you'll know exactly which change caused it.

---

## Testing after an edit

Wait a minute, then open **contactvelorixai-source.github.io/funnel-velorixai** and check:

- Click **Book Demo** → the form opens
- Fill it in → the Thank You page appears
- Click **Book Your Demo** → the calendar opens
- Footer → all three policy links open
- Check it on your phone too
