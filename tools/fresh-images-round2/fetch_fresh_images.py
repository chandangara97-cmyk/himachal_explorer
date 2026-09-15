#!/usr/bin/env python3
"""
fetch_fresh_images.py — searches Pexels for a real travel/landscape photo
matching each place name in all_place_names.json, and downloads the best
match. Unlike the earlier Google Drive migration script, these are NEW
images sourced from the web — not copies of what's already on the site.

Why Pexels: every photo on Pexels is free for commercial use, no
attribution required (though crediting is appreciated) — safe for a live
tourism business site. Random Google Images results are NOT safely
reusable this way; most are copyrighted and not licensed for commercial
reuse, so this script deliberately does not scrape generic search results.

Setup:
    1. Get a free API key: https://www.pexels.com/api/  (instant, no card)
    2. export PEXELS_API_KEY="your_key_here"
       (or edit API_KEY below directly)
    3. pip install requests

Usage:
    python3 fetch_fresh_images.py

Resumable — safe to run in tmux, detach/reattach, re-run to pick up where
it left off. Writes fresh_image_map.json (place name -> local file) and
fetch_fresh_log.txt as it goes.
"""

import json
import os
import re
import sys
import time
import logging

try:
    import requests
except ImportError:
    print("Missing dependency. Run: pip install requests", file=sys.stderr)
    sys.exit(1)

# ── Config ───────────────────────────────────────────────────────────────
API_KEY = os.environ.get("PEXELS_API_KEY", "")  # or hardcode your key here
NAMES_PATH = "all_place_names.json"
OUTPUT_DIR = "fresh_images"
MAPPING_OUT = "fresh_image_map.json"
LOG_FILE = "fetch_fresh_log.txt"
SEARCH_SUFFIX = " Himachal Pradesh India"   # keeps results on-topic
PER_PAGE = 3                                 # pull a few, pick the best-sized one
MAX_RETRIES = 4
RETRY_BACKOFF_SEC = 3
REQUEST_TIMEOUT_SEC = 30
DELAY_BETWEEN_REQUESTS_SEC = 1.0   # Pexels free tier: be gentle
PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search"

# ── Logging ──────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-5s  %(message)s",
    datefmt="%H:%M:%S",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger("fetch_fresh")


def slugify(name: str) -> str:
    s = name.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def search_pexels(query: str, session: requests.Session):
    headers = {"Authorization": API_KEY}
    params = {"query": query, "per_page": PER_PAGE, "orientation": "landscape"}
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            r = session.get(PEXELS_SEARCH_URL, headers=headers, params=params,
                             timeout=REQUEST_TIMEOUT_SEC)
            if r.status_code == 429:
                wait = int(r.headers.get("Retry-After", 5))
                log.warning(f"  rate limited, waiting {wait}s")
                time.sleep(wait)
                continue
            r.raise_for_status()
            return r.json()
        except Exception as e:
            log.warning(f"  search attempt {attempt}/{MAX_RETRIES} failed: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_BACKOFF_SEC * attempt)
    return None


def download_image(url: str, dest_no_ext: str, session: requests.Session) -> str | None:
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            r = session.get(url, timeout=REQUEST_TIMEOUT_SEC, stream=True)
            r.raise_for_status()
            ext = ".jpg"
            ctype = r.headers.get("Content-Type", "")
            if "png" in ctype:
                ext = ".png"
            final_path = dest_no_ext + ext
            with open(final_path, "wb") as f:
                for chunk in r.iter_content(chunk_size=65536):
                    if chunk:
                        f.write(chunk)
            if os.path.getsize(final_path) < 2000:
                os.remove(final_path)
                raise RuntimeError("suspiciously small file")
            return final_path
        except Exception as e:
            log.warning(f"  download attempt {attempt}/{MAX_RETRIES} failed: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_BACKOFF_SEC * attempt)
    return None


def main():
    if not API_KEY:
        log.error("No Pexels API key set. Run: export PEXELS_API_KEY=your_key")
        log.error("Get one free at https://www.pexels.com/api/")
        sys.exit(1)

    if not os.path.exists(NAMES_PATH):
        log.error(f"Can't find {NAMES_PATH} — run this from the repo root.")
        sys.exit(1)

    with open(NAMES_PATH, encoding="utf-8") as f:
        names = json.load(f)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    mapping = {}
    if os.path.exists(MAPPING_OUT):
        with open(MAPPING_OUT, encoding="utf-8") as f:
            mapping = json.load(f)

    session = requests.Session()
    total = len(names)
    ok, failed, skipped = 0, 0, 0
    failures = []

    log.info(f"Starting fresh-image search for {total} places -> {OUTPUT_DIR}/")

    for i, name in enumerate(names, 1):
        slug = slugify(name)
        dest_no_ext = os.path.join(OUTPUT_DIR, slug)

        if slug in mapping and os.path.exists(mapping[slug]["path"]):
            skipped += 1
            log.info(f"[{i}/{total}] SKIP  (already fetched)  {name}")
            continue

        query = name + SEARCH_SUFFIX
        log.info(f"[{i}/{total}] searching  {query}")
        result = search_pexels(query, session)

        photos = (result or {}).get("photos") or []
        if not photos:
            # retry with a plainer query if the specific one found nothing
            result = search_pexels(name + " Himalaya travel", session)
            photos = (result or {}).get("photos") or []

        if not photos:
            failed += 1
            failures.append(name)
            log.error(f"[{i}/{total}] FAIL  {name} — no Pexels results")
            time.sleep(DELAY_BETWEEN_REQUESTS_SEC)
            continue

        best = photos[0]
        img_url = best["src"]["large2x"]
        photographer = best.get("photographer", "unknown")
        pexels_page = best.get("url", "")

        result_path = download_image(img_url, dest_no_ext, session)

        if result_path:
            mapping[slug] = {
                "place_name": name,
                "path": result_path,
                "photographer": photographer,
                "pexels_page": pexels_page,
            }
            ok += 1
            log.info(f"[{i}/{total}] OK    {name} -> {result_path}  (photo by {photographer})")
            with open(MAPPING_OUT, "w", encoding="utf-8") as f:
                json.dump(mapping, f, indent=2, ensure_ascii=False)
        else:
            failed += 1
            failures.append(name)
            log.error(f"[{i}/{total}] FAIL  {name} (download failed)")

        time.sleep(DELAY_BETWEEN_REQUESTS_SEC)

    log.info("=" * 60)
    log.info(f"Done. ok={ok} skipped={skipped} failed={failed} total={total}")
    if failures:
        log.info("No good match found for: " + ", ".join(failures))
    log.info(f"Mapping written to {MAPPING_OUT}")
    log.info(f"Full log in {LOG_FILE}")
    log.info("Remember: Pexels doesn't require attribution, but crediting")
    log.info("photographers (see fresh_image_map.json) is good practice.")


if __name__ == "__main__":
    main()
