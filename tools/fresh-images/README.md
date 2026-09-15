# Fresh images (Pexels, not the old Drive photos)

This fetches BRAND NEW photos for every place/landmark name found in the
codebase — not the images already on Drive. Every photo comes from Pexels,
which is free for commercial use with no attribution required, so it's
safe for a live business site. (Generic Google Images results are NOT used
here deliberately — most aren't licensed for commercial reuse.)

## Coverage
`all_place_names.json` has 184 names, pulled from `images.js`, the Drive
image manifest, `places_patch.json`, and every itinerary/route-stop
reference across `tools/firebase-import/**`.

**Known gap:** the encyclopedia pages (lakes, rivers, passes, glaciers,
valleys, hot springs) render their entity names live from Firebase at
request time — they aren't stored as text in this repo, so those specific
names aren't in this list yet. If you want full encyclopedia coverage,
export the relevant Firebase paths (or share DB read access) and this list
can be extended.

## Setup
1. Free API key (instant, no card): https://www.pexels.com/api/
2. `export PEXELS_API_KEY="your_key_here"`
3. `pip install requests`

## Run
```bash
cd tools/fresh-images
python3 fetch_fresh_images.py
```

Safe to run in `tmux` — resumable, skips anything already fetched on
re-run. Output: `fresh_images/` (the photos) + `fresh_image_map.json`
(place name → local path + photographer credit).

Send both back and the next step is dropping them into
`assets/images/places/` and wiring them into `images.js` /
`package-data.js` in place of the current images.
