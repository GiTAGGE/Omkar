# Omkareshwar Travels — omkareshwartravels.com

Production-ready static site (Netlify) based on the original demo design, with clean URLs, 10 destination routes, SEO, structured data, and WhatsApp booking.

## Quick start

```bash
npm run build
npm run dev   # preview at http://localhost:3456
```

## Netlify deploy

1. Connect this repository to [Netlify](https://www.netlify.com/).
2. Build command: `npm run build` (already in `netlify.toml`).
3. Publish directory: `dist`.
4. Add custom domain **omkareshwartravels.com** and enable HTTPS.
5. Update **phone & WhatsApp** in `site/data/site-contact.json` (email & Hubli hub are set), then rebuild — `site-config.js` is auto-synced on build.

## Google Search Console & sitemap

1. Verify the domain in [Google Search Console](https://search.google.com/search-console).
2. Submit sitemap: `https://omkareshwartravels.com/sitemap.xml`
3. Use URL inspection on the homepage and key route pages (e.g. `/routes/goa/`) to request indexing.

## Routes

| Path | Destination |
|------|-------------|
| `/routes/dandeli/` | Dandeli |
| `/routes/gokarna/` | Gokarna |
| `/routes/murudeshwar/` | Murudeshwar |
| `/routes/goa/` | Goa |
| `/routes/hospet/` | Hospet |
| `/routes/hampi/` | Hampi |
| `/routes/belagavi/` | Belagavi (from Hubli) |

**Hub city:** Hubballi (Hubli) — all copy and SEO centre on Hubli pickups.
| `/routes/coorg/` | Coorg |
| `/routes/udupi/` | Udupi |
| `/routes/jog-falls/` | Jog Falls |

## Edit content

- Route list & meta: `site/data/routes.json`
- Route body copy & FAQs: `scripts/build-site.mjs` (`routeCopy`)
- Styles: `site/assets/css/styles.css`
- After changes: `npm run build`

## Legacy demo

`omkareshwartravels-demo.html` is kept for reference; Netlify redirects it to `/`.
