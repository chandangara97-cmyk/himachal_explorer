#!/usr/bin/env python3
"""
fetch_drive_images.py — downloads every image listed in drive_photo_manifest.json
from Google Drive, saves it locally, and writes a slug->local-path mapping so
images.js / drive_photo_manifest.json can be repointed afterward.

Run this on a machine that can reach drive.google.com (not the Claude sandbox).

Usage:
    python3 fetch_drive_images.py

Requires:
    pip install requests

Resumable: re-running skips any file already downloaded successfully.
Logs progress to fetch_log.txt and prints a live summary to the terminal —
safe to run inside tmux and detach/reattach.
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
# full_drive_manifest.json = every unique Drive file ID referenced ANYWHERE
# in the site (encyclopedia pages, blog, packages, tools/, images.js, etc.),
# extracted directly from the codebase — not just the curated
# drive_photo_manifest.json, which only covered images.js/encyclopedia/packages.
MANIFEST_PATH = "full_drive_manifest.json"      # from the repo root
OUTPUT_DIR = "downloaded_images"                # where files land
MAPPING_OUT = "image_migration_map.json"        # slug -> local path, for the JS rewrite
LOG_FILE = "fetch_log.txt"
MAX_RETRIES = 4
RETRY_BACKOFF_SEC = 3            # multiplied by attempt number
REQUEST_TIMEOUT_SEC = 30
DELAY_BETWEEN_REQUESTS_SEC = 0.5  # be polite to Drive, avoid throttling
DRIVE_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id={file_id}"

# ── Logging: console + file ─────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-5s  %(message)s",
    datefmt="%H:%M:%S",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger("fetch")


def slugify(name: str) -> str:
    s = name.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def guess_extension(resp: requests.Response, fallback: str = ".jpg") -> str:
    ctype = resp.headers.get("Content-Type", "")
    if "png" in ctype:
        return ".png"
    if "webp" in ctype:
        return ".webp"
    if "jpeg" in ctype or "jpg" in ctype:
        return ".jpg"
    return fallback


def download_one(file_id: str, dest_path_no_ext: str) -> str | None:
    """Downloads a Drive file by id. Returns the final path written, or None on failure."""
    url = DRIVE_DOWNLOAD_URL.format(file_id=file_id)
    session = requests.Session()

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = session.get(url, timeout=REQUEST_TIMEOUT_SEC, stream=True)

            # Large Drive files serve an HTML "virus scan warning" page with a
            # confirm token instead of the file directly — follow it.
            if "text/html" in resp.headers.get("Content-Type", ""):
                token = None
                for k, v in resp.cookies.items():
                    if k.startswith("download_warning"):
                        token = v
                if not token:
                    m = re.search(r"confirm=([0-9A-Za-z_]+)", resp.text)
                    if m:
                        token = m.group(1)
                if token:
                    resp = session.get(
                        url + f"&confirm={token}", timeout=REQUEST_TIMEOUT_SEC, stream=True
                    )

            if resp.status_code != 200:
                raise RuntimeError(f"HTTP {resp.status_code}")

            ext = guess_extension(resp)
            final_path = dest_path_no_ext + ext
            with open(final_path, "wb") as f:
                for chunk in resp.iter_content(chunk_size=65536):
                    if chunk:
                        f.write(chunk)

            size = os.path.getsize(final_path)
            if size < 500:  # almost certainly an error page, not a real image
                os.remove(final_path)
                raise RuntimeError(f"suspiciously small response ({size} bytes)")

            return final_path

        except Exception as e:
            log.warning(f"  attempt {attempt}/{MAX_RETRIES} failed for {file_id}: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_BACKOFF_SEC * attempt)

    return None


def main():
    if not os.path.exists(MANIFEST_PATH):
        log.error(f"Can't find {MANIFEST_PATH} — run this from the repo root.")
        sys.exit(1)

    with open(MANIFEST_PATH, encoding="utf-8") as f:
        manifest = json.load(f)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    mapping = {}
    if os.path.exists(MAPPING_OUT):
        with open(MAPPING_OUT, encoding="utf-8") as f:
            mapping = json.load(f)

    total = len(manifest)
    ok, failed, skipped = 0, 0, 0
    failures = []

    log.info(f"Starting fetch of {total} images -> {OUTPUT_DIR}/")

    for i, entry in enumerate(manifest, 1):
        file_id = entry.get("drive_file_id")
        names = entry.get("names") or []
        # full_drive_manifest.json entries may have 0+ names (multiple pages
        # can reuse the same Drive image under different labels); fall back
        # to the file_id itself so every image still gets downloaded.
        name = names[0] if names else file_id
        slug = slugify(name) if name else f"file-{i}"
        dest_no_ext = os.path.join(OUTPUT_DIR, slug)

        # Resume support: skip if we already recorded a successful download
        if slug in mapping and os.path.exists(mapping[slug]):
            skipped += 1
            log.info(f"[{i}/{total}] SKIP  (already downloaded)  {name}")
            continue

        if not file_id:
            failed += 1
            failures.append(name)
            log.error(f"[{i}/{total}] FAIL  (no drive_file_id)  {name}")
            continue

        log.info(f"[{i}/{total}] fetching  {name}  ({file_id})")
        result_path = download_one(file_id, dest_no_ext)

        if result_path:
            mapping[slug] = result_path
            ok += 1
            log.info(f"[{i}/{total}] OK    {name} -> {result_path}")
            # Save mapping incrementally so a crash doesn't lose progress
            with open(MAPPING_OUT, "w", encoding="utf-8") as f:
                json.dump(mapping, f, indent=2, ensure_ascii=False)
        else:
            failed += 1
            failures.append(name)
            log.error(f"[{i}/{total}] FAIL  {name} (exhausted retries)")

        time.sleep(DELAY_BETWEEN_REQUESTS_SEC)

    log.info("=" * 60)
    log.info(f"Done. ok={ok} skipped={skipped} failed={failed} total={total}")
    if failures:
        log.info("Failed items: " + ", ".join(failures))
    log.info(f"Mapping written to {MAPPING_OUT}")
    log.info(f"Full log in {LOG_FILE}")


if __name__ == "__main__":
    main()
