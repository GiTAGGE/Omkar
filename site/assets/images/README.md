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

## Source files (edit these)

**`uploads/`** holds human-readable filenames; **`manifest.json`** maps them to live paths. Run `npm run build` to sync.

See **`uploads/README.md`** for the full filename list (10 photos from your chat + 4 stock placeholders to replace).

## Re-download stock placeholders

If you change URLs in `scripts/fetch-images.mjs` (does not overwrite custom fleet/Hampi etc. unless you re-run for those slugs):

```bash
npm run images
```
