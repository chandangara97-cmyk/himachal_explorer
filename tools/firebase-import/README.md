# Firebase import files — Himachal Explorer

I don't have network access or credentials to your live Firebase project from
this sandbox, so I can't push these myself. These files are ready to import —
pick whichever method is easiest for you.

## What's in here

- `templates_templates_<slug>.json` × 11 — one per missing package, matching
  the exact schema `package-detail.html` already reads from
  `templates/templates/<slug>`.
- `package_pricing_matrix_<slug>.json` × 11 — the pricing grid (2–10 pax ×
  budget/premium/luxury × peak/off-peak) matching `package_pricing_matrix/<slug>`.
- `places_patch.json` — adds the 2 missing place records (`sarahan`, `dhankar`)
  referenced by the 16-day flagship itinerary but absent from `PLACES`.

⚠️ **The prices in the pricing-matrix files are formula-estimated** (hotel
tier × nights + vehicle cost ÷ group size — see `assets/js/pkg-engine.js` for
the exact model), not your real rates. Review/adjust the numbers before
treating them as final quotes. Each file is flagged `"estimated": true` so
your UI already shows a disclaimer to visitors.

## Option A — Firebase Console (no tooling needed)

1. Open your Realtime Database in the Firebase console.
2. Navigate to `templates > templates`.
3. Click the ⋮ menu → **Import JSON** on the `templates` node — but since
   Import replaces everything under that node, instead: create a new child
   node manually named after the slug (e.g. `spiti-village-circuit-5d`), then
   paste the contents of `templates_templates_spiti-village-circuit-5d.json`
   into it (use the "+" to add nested fields, or edit the raw value if the
   console supports pasting a JSON blob into a new key).
4. Repeat under `package_pricing_matrix` for each `package_pricing_matrix_<slug>.json`.
5. Repeat for `places_patch.json` — merge its two keys into wherever you
   store `PLACES` server-side (if you keep PLACES only in `packages-data.js`,
   skip this step and instead hand-edit that file — see note below).

## Option B — Firebase CLI (fastest, does one node at a time safely)

```bash
firebase database:set /templates/templates/spiti-village-circuit-5d \
  firebase-import/templates_templates_spiti-village-circuit-5d.json \
  --project <your-project-id>

firebase database:set /package_pricing_matrix/spiti-village-circuit-5d \
  firebase-import/package_pricing_matrix_spiti-village-circuit-5d.json \
  --project <your-project-id>
```
Run once per slug (11 templates + 11 pricing matrices = 22 commands). This
sets only that one child node — it won't touch anything else in the database.

## Option C — REST API with your database secret

```bash
curl -X PUT \
  -d @firebase-import/templates_templates_spiti-village-circuit-5d.json \
  "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app/templates/templates/spiti-village-circuit-5d.json?auth=YOUR_DATABASE_SECRET"

curl -X PUT \
  -d @firebase-import/package_pricing_matrix_spiti-village-circuit-5d.json \
  "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app/package_pricing_matrix/spiti-village-circuit-5d.json?auth=YOUR_DATABASE_SECRET"
```
Swap in the other 10 slugs the same way. Get `YOUR_DATABASE_SECRET` from
Project Settings → Service Accounts → Database Secrets (legacy) in the
Firebase console, or use an OAuth token if you've migrated off legacy secrets.

## Note on `places_patch.json`

Your `PLACES` data lives in `assets/js/packages-data.js`, not Firebase — the
site never reads places from the database. So the simplest fix for the
`sarahan`/`dhankar` gap is just to merge the two keys in `places_patch.json`
into the `PLACES` object in that file directly, no Firebase step needed. Say
the word and I'll make that edit for you in the project files instead.

## The 11 slugs covered

amritsar-chamba-4d, amritsar-parvati-5d, chamba-pangi-5d, chamba-sach-6d,
kangra-kareri-triund-4d, kinnaur-spiti-connect-7d, manali-hidden-4d,
parvati-hidden-4d, parvati-trek-5d, spiti-gue-mummy-5d,
spiti-village-circuit-5d
