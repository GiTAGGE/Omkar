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

## Re-download stock images

If you change URLs in `scripts/fetch-images.mjs`:

```bash
npm run images
```
