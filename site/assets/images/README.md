# Site images

Replace files here to update the live site (then `npm run build`).

## Layout

```
images/
  home/
    hero.jpg      # Homepage hero background
    about.jpg     # About section
  fleet/
    sedan.jpg
    suv.jpg
    tempo-traveller.jpg
  destinations/
    {slug}/
      card.jpg    # Destination grid on homepage
      hero.jpg    # Route page hero background
```

Slug folders match `site/data/routes.json` (e.g. `goa`, `jog-falls`, `murudeshwar`).

## Custom photos (current)

| Folder | Image content |
|--------|----------------|
| `fleet/` | Dzire sedan, SUV, Force Tempo Traveller |
| `destinations/hampi/` | Stone Chariot (card), Anjanadri hill temple (hero) |
| `destinations/hospet/` | Hill fort viewpoint |
| `destinations/coorg/` | Raja’s Seat–style hill viewpoint |
| `destinations/udupi/` | Coastal basalt rock formations (Malpe / St. Mary’s area) |
| `destinations/gokarna/` | Om Beach aerial |
| `destinations/murudeshwar/` | Shiva statue & temple coast |
| `destinations/dandeli`, `goa`, `belagavi`, `jog-falls` | Stock placeholders — replace JPGs anytime |

## Re-download stock placeholders

If you change URLs in `scripts/fetch-images.mjs` (does not overwrite custom fleet/Hampi etc. unless you re-run for those slugs):

```bash
npm run images
```
