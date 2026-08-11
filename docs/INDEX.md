# Himachal Explorer — Repository Index

Reorganized for GitHub Pages. All live page URLs, GitHub Pages root files,
absolute `https://himachalexplorer.in/...` references, and Search Console
verification paths were left untouched at root — only loose images/css/js
were moved into `assets/`. Zero broken links (full report below).

## Root (unchanged — must stay at root for GitHub Pages / SEO / Ads)

**Core pages**
- `index.html` — homepage
- `explore.html`, `packages.html`, `package-detail.html`, `place.html` — browse/booking flow
- `booking.html`, `thank-you.html` — checkout + Google Ads conversion page
- `dist_master.html` (live district guide, `?d=` query param), `dist_index.html` (older parallel district index)
- `yui.html` — route builder ("Plan Your Himachal Route")
- `bike-rental.html` — Rent a Bike
- `himachal_calculator.html`, `himachal-image-tool.html`, `webpage_management.html`, `control.html` — internal/admin tools (unlinked, direct-URL access only)
- `home.html` — redirect stub → `/index.html`
- `Exp.html` — **legacy/orphaned page**, not linked anywhere, references a nonexistent `./style/images/` folder and a different GitHub repo (`champishere001/Himachal_Explorer`). Pre-existing broken page, untouched by this reorg. Safe to delete if not needed.

**12 district SEO redirect stubs** (each does `meta refresh` → `/dist_master.html?d=...`):
`shimla.html`, `kullu.html`, `kangra.html`, `kinnaur.html`, `mandi.html`, `chamba.html`, `hamirpur.html`, `una.html`, `bilaspur.html`, `sirmour.html`, `solan.html`, `spiti.html`

**GitHub Pages / Search Console requirements (must stay exactly here)**
- `CNAME`, `sitemap.xml`, `README.md`
- `google324f79d7efe6ddac.html`, `google46145a5e8d86a4ed.html`
- `logo-512.png` — kept at root because it's referenced via absolute URL (`https://himachalexplorer.in/logo-512.png`) in OG/Twitter meta tags, apple-touch-icon, and JSON-LD across 4 pages

## /assets/images/  (96 files)
All loose `.jpg` / `.jpeg` / `.webp` / `.png` photos (place photos, hero images, logo-goibibo/makemytrip/yatra comparison logos, the AI-generated hero PNG). Roughly 37 are actively referenced by `index.html`, `packages.html`, `dist_master.html`, `himachal-image-tool.html`; the rest are spare/extra variants not currently wired into any page — kept rather than deleted in case they're needed for future updates.

## /assets/css/
- `district.css` — **currently unused/orphaned**, not linked from any page (superseded by inline styles in `dist_master.html`)

## /assets/js/
- `images.js` — Google Drive-hosted image map (used by your AI Planner / route builder data layer, not loaded as a `<script>` tag anywhere in this bundle)
- `district.js` — **currently unused/orphaned**, looks like an earlier iteration of `dist_master.html`'s logic before it was inlined

## /assets/src/
- `PackageItinerary.jsx` — React source file, not part of the static deployment (dev reference only)

## /pkg/  (24 package detail pages, unchanged — already a clean subfolder)

## /_review/  (flagged for your decision — not part of the live site, won't affect anything)
- `chandigarh-grand-himachal-16d (1).html` — stray duplicate of `pkg/chandigarh-grand-himachal-16d.html` with older/different meta tags. Was sitting loose at repo root.
- `pkg_stray_j_file.txt` — empty garbage file that was at `pkg/j`
- `pkg_google46145a5e8d86a4ed.html` — redundant copy of the Search Console verification file that was sitting inside `/pkg/` (verification only works from domain root, so this copy did nothing)

## Bug fixes made during reorg
1. **`dist_master.html`**: Chamba's `hero_image` was `"khajiar_1.jpg"` (typo, file never existed) → fixed to `"assets/images/khajjiar_02.jpg"` (the actual file). This image was broken on the live site before this fix.
2. **`booking.html`**: Razorpay `image` field pointed to `https://himachalexplorer.in/assets/logo.png` (never existed) → fixed to the real `https://himachalexplorer.in/logo-512.png`.

## Verification
Every quoted local `.jpg/.jpeg/.webp/.png/.css/.js` reference across all 32 root HTML files + 24 pkg pages was resolved against the new file tree after the move. 62 real references checked, 0 broken (the only non-resolving matches were pre-existing issues in `Exp.html`, plus false positives from placeholder text/JS string literals that aren't actual file references — see audit detail in conversation).
