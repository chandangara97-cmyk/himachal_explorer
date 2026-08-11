# 🏨 Himachal Explorer — Hotel Bulk Upload System

Populate the Himachal Explorer hotel contacts database with real hotel data using **seasonal pricing tiers** and **bulk upload scripts**.

---

## 📋 What's Included

| File | Purpose |
|------|---------|
| `hotel-contacts.html` | Admin UI with peak/off-season rates + MakeMyTrip-style cards |
| `hotel-bulk-template.csv` | Ready-to-fill CSV template for batch uploads |
| `hotel-bulk-upload.js` | Node.js script: reads CSV → pushes to Firebase |
| `hotel-bulk-upload.sh` | Bash fallback (no dependencies) |

---

## 🚀 Quick Start

### Step 1: Fill the CSV Template

Open `hotel-bulk-template.csv` in a spreadsheet editor (Google Sheets, Excel, LibreOffice):

```csv
city,name,tier,location,contact,rooms,rate,ratePeak,rateOff,photo,lat,lng,discountNote
shimla,Woodstock Inn,premium,"Hotel Oakville, The Ridge",9876543210,6,2500,3500,2250,https://images.unsplash.com/...,31.7741,77.1717,Book 3+ nights: save ₹500/night
```

**Key Rules:**
- **city**: Single-word lowercase (shimla, sangla, kinnaur, spiti, rampur, etc)
- **tier**: `budget`, `premium`, or `luxury`
- **contact**: 10-digit phone (no +91 or spaces)
- **rate**: Standard B2B per-night rate in ₹
- **ratePeak**: (Optional) Higher rate Apr-Jun, Sep-Oct
- **rateOff**: (Optional) Promotional/bulk rate; auto-fills to 90% of standard if blank
- **photo**: Unsplash URL with `?w=400` for fast loading
- **lat, lng**: Decimal GPS (optional; map works without)

### Step 2: Use the Upload Script

#### **Option A: Node.js (Termux / Desktop)**

```bash
# One-time setup (first time only)
npm install csv-parser

# Run upload
node hotel-bulk-upload.js hotel-bulk-template.csv
```

Output:
```
📊 Parsed 42 hotel(s) from hotel-bulk-template.csv

🚀 Uploading 42 hotel(s) to Firebase…

✓ [1/42] Woodstock Inn (shimla/premium) → -NzK4x...
✓ [2/42] Kinner Camps (sangla/luxury) → -NzK4y...
...
✅ Uploaded 42/42 hotels
🎉 All records pushed to Firebase!
```

#### **Option B: Bash (No Dependencies)**

```bash
chmod +x hotel-bulk-upload.sh
bash hotel-bulk-upload.sh hotel-bulk-template.csv
```

Requires `curl` (usually pre-installed on Termux/Linux).

### Step 3: Verify in Admin UI

1. Open `hotel-contacts.html` in a browser (locally or upload to your site)
2. Filter by city/tier to see your new hotels
3. Cards now show **three price tiers**:
   - 🟢 Standard (Jul-Aug, Dec-Mar)
   - 🔴 Peak (Apr-Jun, Sep-Oct)
   - 🟡 Promo (bulk/loyalty)

---

## 💾 Database Schema

Each hotel record stored in Firebase Realtime Database:

```json
{
  "hotels": {
    "shimla": {
      "-NzK4x...": {
        "name": "Woodstock Inn",
        "tier": "premium",
        "location": "Hotel Oakville, The Ridge",
        "contact": "9876543210",
        "rooms": 6,
        "rate": 2500,
        "ratePeak": 3500,
        "rateOff": 2250,
        "photo": "https://images.unsplash.com/...",
        "lat": 31.7741,
        "lng": 77.1717,
        "discountNote": "Book 3+ nights: save ₹500/night",
        "addedAt": 1718937600000
      }
    }
  }
}
```

---

## 🎨 Pricing Display on Frontend

Visitors see seasonal rates on package cards:

```
Standard: ₹2500/night
Peak: ₹3500/night (Apr-Jun, Sep-Oct)
Promo: ₹2250/night (bulk/loyalty discount)
```

The `rate` is always visible; `ratePeak` and `rateOff` are conditional badges.

---

## ✏️ Manual Edits

Use the **Admin UI** (`hotel-contacts.html`) to:
- ✏️ Edit individual hotels (update rates, photos, contact)
- 🗑️ Delete outdated listings
- 🔍 Filter by city/tier/search term
- 📍 Use geolocation button to auto-fill GPS coords

---

## ⚡ Tips & Troubleshooting

### Firebase Auth / CORS Issues
If bulk upload fails with `HTTP 401` or CORS errors:
1. Check Firebase Realtime Database rules allow POST to `/hotels/`
2. Public read-write rules during testing:
   ```json
   {
     "rules": {
       "hotels": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```

### Photo URLs
- Unsplash is free, fast, no auth needed
- Pattern: `https://images.unsplash.com/photo-XXXXX?w=400&q=80`
- Avoid large images (slow load on 4G)

### CSV Format Issues
- Use **UTF-8 encoding** (not Latin-1)
- No extra spaces around commas
- Quote values with commas: `"Jaipur, Rajasthan"`
- Test first row manually in admin before bulk upload

### Termux Specific
```bash
# Install Node.js if not present
apt update && apt install nodejs

# If csv-parser fails, use built-in Node.js CSV hack:
# Delete csv-parser line, use native JSON.parse on split rows
```

---

## 📞 Contact Info Handling

- Phone numbers are **clickable WhatsApp links** on the frontend
- Format stored as: `9876543210` (no +91, no spaces)
- Displayed as: 💬 9876543210 → https://wa.me/919876543210

---

## 🔄 Bulk Updates

To **replace all hotels** (nuke + reload):
1. Delete the `/hotels` node in Firebase Console
2. Re-run the CSV upload script

---

## 📊 Expected CSV Layout

| Column | Type | Required | Example |
|--------|------|----------|---------|
| city | text | ✓ | `shimla` |
| name | text | ✓ | `Woodstock Inn` |
| tier | text | ✓ | `premium` |
| location | text | | `The Ridge, Shimla` |
| contact | text | | `9876543210` |
| rooms | number | | `6` |
| rate | number | ✓ | `2500` |
| ratePeak | number | | `3500` |
| rateOff | number | | `2250` |
| photo | URL | | `https://...` |
| lat | decimal | | `31.7741` |
| lng | decimal | | `77.1717` |
| discountNote | text | | `Book 3+ nights...` |

---

## 🛠️ Customization

### Change Firebase URL
Edit both scripts to point to your Firebase instance:
```javascript
const DB = "https://your-project.firebaseio.com";
```

### Add More Fields
To add fields (e.g., `checkInTime`, `amenities`):
1. Add columns to CSV
2. Update `hotel-bulk-upload.js` to parse new fields
3. Update `hotel-contacts.html` form to capture them
4. Update `hotelCardHTML()` to display them

### Custom Pricing Formula
Modify `autoDiscount()` in admin UI:
```javascript
function autoDiscount() {
  const rate = parseFloat(document.getElementById("fRate").value);
  const offEl = document.getElementById("fRateOff");
  if (rate && !offEl.dataset.touched) {
    // Change from 0.9 to your formula
    offEl.value = Math.round(rate * 0.85); // 15% discount instead of 10%
  }
}
```

---

## 📈 Best Practices

1. **Test First**: Add 2-3 hotels manually via admin UI before bulk uploading 50+
2. **Real Data Only**: Never fabricate phone numbers or GPS coords
3. **Photos**: Use Unsplash (royalty-free, no auth), resize to w=400
4. **Backup**: Export Firebase JSON before bulk update (`firebase database:get /hotels --output hotels-backup.json`)
5. **Pricing**: Keep rate < ratePeak < rate*1.5 to stay believable

---

## 📱 Frontend Display

Hotels appear on:
- `/packages.html` → Partner hotel cards in package details
- `/index.html` → Featured "best hotels" section
- Admin page `/hotel-contacts.html` → Management interface

---

**Built for Himachal Explorer | Est. 2024**
