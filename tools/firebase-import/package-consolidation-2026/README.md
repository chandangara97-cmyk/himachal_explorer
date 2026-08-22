# Package data consolidation — import these into Firebase

This folder makes Firebase the **only** place package info lives. Every page
(`packages.html`, `package-detail.html`, `booking.html`) now fetches from
`/templates_index` + `/package_content` at runtime via
`assets/js/package-data.js` — there's no local `PACKAGES` / `ITINERARIES`
array in any page anymore.

The richer, hand-written itinerary text and curated images that used to live
only in `packages.html` and `assets/js/packages-data.js` are in these 44
patch files, ready to merge into your live database (I don't have
credentials to push them myself).

## What's in here

- `templates_index_PATCH_<slug>.json` × 22 — adds the 3 fields your live
  `/templates_index/<slug>` records were missing: `end_point`,
  `total_km_est`, `featured`.
- `package_content_PATCH_<slug>.json` × 22 — upgrades `/package_content/<slug>`
  with the richer day-by-day itinerary (3 activity bullets/day instead of one
  merged line) and the curated per-package photo. **This only touches the
  `itinerary`, `image`, `highlight`, and `curated_tags` fields** — your
  existing `inclusions`, `exclusions`, and `route_stops` for these 22
  packages are left exactly as they are in Firebase now.

These 22 slugs are the ones that had hand-written content anywhere in the
codebase (`packages.html`'s `ITINERARIES`/`PKG_IMG` object,
`assets/js/packages-data.js`'s richer 22-package copy — I merged the two and
kept whichever had more detail). The other 18 packages already in your
`/templates_index` had no local hand-written override anywhere, so there's
nothing to patch for them — they'll render fine from what's already in
Firebase, just with the plainer one-line-per-day itinerary until you add
richer content for them too.

**Every field name matches your existing schema exactly** — nothing new is
introduced, so `package-data.js`'s normalizer doesn't need any special-casing
per package.

## How to apply

Use **PATCH** (not PUT) so you only add these fields without touching
anything else already at that path.

### Option A — Firebase CLI
```bash
firebase database:update /templates_index/<slug> \
  tools/firebase-import/package-consolidation-2026/templates_index_PATCH_<slug>.json \
  --project <your-project-id>

firebase database:update /package_content/<slug> \
  tools/firebase-import/package-consolidation-2026/package_content_PATCH_<slug>.json \
  --project <your-project-id>
```
Run once per slug (see the file list in this folder for all 22).

### Option B — REST API (HTTP PATCH, not PUT)
```bash
curl -X PATCH \
  -d @tools/firebase-import/package-consolidation-2026/templates_index_PATCH_<slug>.json \
  "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app/templates_index/<slug>.json?auth=YOUR_DATABASE_SECRET"

curl -X PATCH \
  -d @tools/firebase-import/package-consolidation-2026/package_content_PATCH_<slug>.json \
  "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app/package_content/<slug>.json?auth=YOUR_DATABASE_SECRET"
```
Get `YOUR_DATABASE_SECRET` from Project Settings → Service Accounts →
Database Secrets (legacy) in the Firebase console.

### Option C — Firebase Console
Open Realtime Database → navigate to `templates_index/<slug>` → use the ⋮
menu on that node → add each field from the patch file manually (console
"Import JSON" always *replaces* the whole node, so for individual field
additions the manual route is safer than Import here).

## Until you apply these

Nothing breaks. Every page already falls back gracefully:
- Missing `end_point`/`total_km_est`/`featured` → `package-data.js` just
  omits them (`end_point` falls back to `start_point`).
- Missing rich itinerary → the page uses whatever's already in
  `/package_content/<slug>.itinerary`, just with one description line
  per day instead of the 3-bullet version.

## ⚠️ One unrelated thing I noticed while auditing the export

Your database has a stray node at `/templates/templates`, `/templates/places`,
etc. — it looks like a full duplicate of the *entire* database nested one
level down under `/templates`. `yui.html` reads from `/templates` for its
place/package fallback and seems unaffected, but it's ~2× the data you need
sitting in the DB. Not touched by anything in this patch — flagging it in
case you want to clean it up separately.
