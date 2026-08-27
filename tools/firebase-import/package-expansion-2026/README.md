# 55 new hub packages — import these into Firebase

Same pattern as `package-consolidation-2026/` next door, but these are **new**
packages (not upgrades to existing ones), so use **PUT** (`database:set` /
HTTP `PUT`) — not PATCH — since you're creating the node, not editing it.

Nothing else needs to change. `packages.html` and `package-detail.html` both
fetch live from `/templates_index` + `/package_content` via
`assets/js/package-data.js` — once these 55 slugs exist there, they show up
on the site automatically. No HTML/JS edits needed.

## What's in here

- `templates_index_<slug>.json` × 55 — identity record (name, days,
  start_point, best_season, hotel_star, budget_price_pp, status: "active", tags)
- `package_content_<slug>.json` × 55 — itinerary, inclusions, exclusions,
  image, route_stops

Covers 6 hubs from your day-tier matrix:
`shimla-*` (10), `manali-*` (10), `kasol-*` (10), `dharamshala-*` (10),
`spiti-*` (10), `dalhousie-*` (5).

No slug collides with your existing 40 packages.

## How to apply

### Option A — Firebase CLI
```bash
firebase database:set /templates_index/<slug> \
  tools/firebase-import/package-expansion-2026/templates_index_<slug>.json \
  --project <your-project-id>

firebase database:set /package_content/<slug> \
  tools/firebase-import/package-expansion-2026/package_content_<slug>.json \
  --project <your-project-id>
```
Run once per slug — see the file list in this folder for all 55 (or loop over
`templates_index_*.json`, strip the prefix/suffix to get each slug).

### Option B — REST API
```bash
curl -X PUT \
  -d @tools/firebase-import/package-expansion-2026/templates_index_<slug>.json \
  "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app/templates_index/<slug>.json?auth=YOUR_DATABASE_SECRET"

curl -X PUT \
  -d @tools/firebase-import/package-expansion-2026/package_content_<slug>.json \
  "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app/package_content/<slug>.json?auth=YOUR_DATABASE_SECRET"
```

### Option C — Firebase Console
Realtime Database → `templates_index` → ⋮ → **Import JSON** on a *new* child
node named after the slug → paste the file content. Repeat under
`package_content`. (Import replaces a node's contents — safe here since
these are brand-new keys, not existing ones.)

## Pricing — no pricing-matrix files included, and that's fine

None of these 55 have a `/package_pricing_matrix/<slug>` entry. Unlike the
old static pages, `assets/js/pkg-engine.js` already has a fallback
(`buildFallbackPriceMatrix`) that computes a live budget/premium/luxury ×
2–10 pax grid on the fly from `pkg.days`, `hotel_star` and an estimated
vehicle cost whenever the Firebase matrix is missing — so pricing on
`package-detail.html` works immediately without any extra import. It's
flagged `estimated: true` in the code, same as your other estimated pricing.

If you later want hand-costed pricing for any of these (real vehicle
contracts instead of the formula), add a `/package_pricing_matrix/<slug>`
entry the same way as your other active packages and it'll take over
automatically.

## Things worth checking before/after import

- `budget_price_pp` in each `templates_index_<slug>.json` is a rough
  ₹/day heuristic (₹2,500/day, ₹3,400/day for the Spiti hub) — replace with
  your real per-package number once you have one; it's only used as a
  display figure, not for the actual pricing calculation above.
- A handful of `route_stops` coordinates (Sarahan, Hampta Pass, Bhrigu Lake,
  Bhagsu Falls, Indrahar Pass) aren't in your `/places` node, so I used
  approximate real-world coordinates for those five. Worth a spot-check
  before relying on them for routing/maps.
- `image` is the same placeholder Unsplash photo across all 55 — swap in
  real per-package photos when you have them, same as you've done for the
  existing packages.
