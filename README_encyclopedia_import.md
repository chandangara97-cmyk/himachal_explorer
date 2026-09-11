# Encyclopedia / Explore Firebase import — 55 new places

`encyclopedia_places_new.json` adds full records for the 55 places that were
missing from `PLACES` (packages.html) AND from Firebase — this covers the
`encyclopedia*.html` / `explore.html` / `place.html` side, which reads live
from Realtime Database at `/places/{id}`.

Each record includes: `name, category, district, region, segment,
history_tagline, what_you_find, latitude, longitude, photo_1`.

**Note on photos:** each record only has `photo_1` filled in — I only
resolved one Drive file ID per place. Your existing records support up to
`photo_4`; the Drive folder has `-2.jpg` / `-3.jpg` variants for most of
these too. Send the word and I'll go back and resolve those file IDs the
same way, or you can add `photo_2`/`photo_3` yourself by grabbing the file
ID from each image's Drive share link and using the same
`https://drive.google.com/thumbnail?id=FILE_ID&sz=w800` format.

**Flag before importing:** `district`, `region`, `segment`, and
`what_you_find` are my best-effort drafts, not sourced facts the way
lat/lng were — review these, especially for the more obscure places
(Kutlehar Fort, Lalung Monastery, Moorang, Dehnasar Lake, Cholling
Monastery, Chindi Mata Temple, Tauni Devi Temple), before publishing.

## Option A — Firebase Console
For each of the 55 keys in the JSON: Realtime Database → `places` node →
add a new child keyed by the slug (e.g. `sunset-point-kasauli`) → paste
that place's object in as the value.

## Option B — Firebase CLI (one place at a time, safe)
```bash
firebase database:set /places/sunset-point-kasauli \
  encyclopedia_places_new_single/sunset-point-kasauli.json \
  --project <your-project-id>
```
(You'd need to split the combined JSON into one file per key first — say
the word and I'll generate 55 individual files instead of one combined one.)

## Option C — REST API with your database secret
```bash
curl -X PUT \
  -d '{"name":"Sunset Point Kasauli", ...}' \
  "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app/places/sunset-point-kasauli.json?auth=YOUR_DATABASE_SECRET"
```
Get `YOUR_DATABASE_SECRET` from Project Settings → Service Accounts →
Database Secrets (legacy) in the Firebase console.

## Fastest option — a real import script
If you'd rather not do this by hand 55 times, tell me and I'll write a
small Node/Python script that reads `encyclopedia_places_new.json` and
`PUT`s each key to `/places/<slug>.json` in one run — you'd just need to
supply your database secret when you run it locally (never paste it into
this chat).
