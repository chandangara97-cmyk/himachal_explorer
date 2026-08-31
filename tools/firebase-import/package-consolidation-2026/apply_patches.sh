#!/usr/bin/env bash
#
# apply_patches.sh — pushes all 22 templates_index + package_content PATCH
# pairs in this folder to the live Firebase RTDB in one run.
#
# Usage:
#   export FIREBASE_DB_SECRET="your-legacy-database-secret"
#   ./apply_patches.sh
#
# Get the secret from: Firebase Console → Project Settings →
# Service Accounts → Database Secrets (legacy).
#
# Uses HTTP PATCH (not PUT), so it only adds/overwrites the specific
# fields in each file — everything else already at that path
# (inclusions, exclusions, route_stops, etc.) is left untouched.
#
# Safe to re-run: idempotent, same result every time.

set -euo pipefail

DB_BASE="https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -z "${FIREBASE_DB_SECRET:-}" ]]; then
  echo "ERROR: set FIREBASE_DB_SECRET first, e.g.:"
  echo "  export FIREBASE_DB_SECRET=\"your-legacy-database-secret\""
  exit 1
fi

SLUGS=(
  chamba-pangi-5d
  chamba-sach-6d
  chandigarh-best-value-5d
  chandigarh-grand-himachal-16d
  chandigarh-jibhi-seraj-4d
  chandigarh-kasauli-barog-2d
  chandigarh-prashar-mandi-3d
  delhi-himachal-best-value-7d
  delhi-himachal-complete-10d
  delhi-kinnaur-spiti-10d
  delhi-renuka-tattapani-3d
  kangra-offbeat-4d
  kinnaur-complete-6d
  lower-hp-offbeat-3d
  manali-lahaul-5d
  mandi-janjehli-4d
  mandi-offbeat-3d
  seraj-offbeat-4d
  shimla-apple-belt-4d
  shimla-hidden-3d
  sirmaur-hidden-4d
  tirthan-sainj-5d
)

ok=0
fail=0
failed_slugs=()

for slug in "${SLUGS[@]}"; do
  ti_file="$SCRIPT_DIR/templates_index_PATCH_${slug}.json"
  pc_file="$SCRIPT_DIR/package_content_PATCH_${slug}.json"

  if [[ ! -f "$ti_file" || ! -f "$pc_file" ]]; then
    echo "SKIP  $slug — patch file missing"
    fail=$((fail+1)); failed_slugs+=("$slug (missing file)")
    continue
  fi

  ti_status=$(curl -s -o /tmp/ti_resp.json -w "%{http_code}" -X PATCH \
    -d @"$ti_file" \
    "${DB_BASE}/templates_index/${slug}.json?auth=${FIREBASE_DB_SECRET}")

  pc_status=$(curl -s -o /tmp/pc_resp.json -w "%{http_code}" -X PATCH \
    -d @"$pc_file" \
    "${DB_BASE}/package_content/${slug}.json?auth=${FIREBASE_DB_SECRET}")

  if [[ "$ti_status" == "200" && "$pc_status" == "200" ]]; then
    echo "OK    $slug"
    ok=$((ok+1))
  else
    echo "FAIL  $slug  (templates_index: $ti_status, package_content: $pc_status)"
    echo "        templates_index response: $(cat /tmp/ti_resp.json)"
    echo "        package_content response: $(cat /tmp/pc_resp.json)"
    fail=$((fail+1)); failed_slugs+=("$slug")
  fi
done

echo
echo "Done: $ok succeeded, $fail failed."
if [[ $fail -gt 0 ]]; then
  echo "Failed slugs: ${failed_slugs[*]}"
  exit 1
fi
