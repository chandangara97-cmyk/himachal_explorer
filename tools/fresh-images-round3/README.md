# Round 3 — Encyclopedia + District page photos

224 names covering:
- Encyclopedia entries in visual categories (glaciers, hot springs/waterfalls,
  lakes, mountain passes, rivers, trekking routes, valleys) not yet matched
- District-page place cards (the "attractions in this district" lists)
- A few district hero banner images

Skipped deliberately: encyclopedia's "environment_and_conservation" and
"historical_social_reference_content" categories — those are topic articles
(e.g. deforestation, government commissions), not physical locations, so a
stock photo doesn't add anything real. They'll keep the placeholder look,
which is fine.

Heads up: some of these are very obscure/remote (individual named glaciers
in Lahaul-Spiti, tiny springs, etc.) — Pexels may not have a real photo for
every single one. The script will just fail gracefully on those (logged,
not fatal) and they'll keep the placeholder card style.

## Run (same as before)
```bash
cd tools/fresh-images-round3
export PEXELS_API_KEY="your_key"
python3 fetch_fresh_images.py
```
224 searches will take a while (~4-5 min at 1 req/sec) — fine to detach via
tmux and check back later. Resumable if interrupted.
