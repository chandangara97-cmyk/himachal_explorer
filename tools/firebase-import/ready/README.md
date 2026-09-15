# Ready-to-import Firebase data

Full replacement trees for 4 RTDB paths, images fixed. Each file's name
matches its target path.

## Import via curl (fast — run from your phone, no Console clicking)

```bash
cd ~/himachal_explorer/tools/firebase-import/ready
DB="https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app"

curl -X PUT "$DB/places.json" -d @places.json
curl -X PUT "$DB/package_content.json" -d @package_content.json
curl -X PUT "$DB/encyclopedia.json" -d @encyclopedia.json
curl -X PUT "$DB/districts.json" -d @districts.json
```

If your database security rules require auth for writes, each curl will
return a `PERMISSION_DENIED` error instead of the new data — in that case,
fall back to the Firebase Console → Realtime Database → ⋮ → Import JSON
for each file/path instead (slower but always works, since you're logged
in as the project owner there).

**Double-check each path before running** — a PUT to the wrong path
replaces whatever's currently there.
