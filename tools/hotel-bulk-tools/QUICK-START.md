# 🏨 Hotel Seasonal Pricing — Quick Start (1 Page)

## What You Get

✅ **Admin UI** with seasonal pricing (Standard + Peak + Promo rates)  
✅ **CSV bulk-upload template** for real hotel data  
✅ **Node.js script** for fast batch push to Firebase  
✅ **Bash script** (no dependencies) alternative  
✅ **MakeMyTrip-style pricing cards** on frontend  

---

## 60-Second Workflow

### 1. **Fill CSV** (10 min)
```bash
# Open hotel-bulk-template.csv in spreadsheet
# Add your hotels with 3 rates each:
city,name,tier,rate,ratePeak,rateOff,...
shimla,Oakville,premium,2500,3500,2250,...
sangla,Kinner,luxury,4500,5800,4050,...
```

### 2. **Bulk Push** (2 min)
```bash
# Option A (faster): Node.js
npm install csv-parser
node hotel-bulk-upload.js hotel-bulk-template.csv

# Option B (no deps): Bash
bash hotel-bulk-upload.sh hotel-bulk-template.csv
```

### 3. **Done**
All hotels now in Firebase with seasonal rates. View in admin UI or on frontend package pages.

---

## File Guide

| File | How to Use |
|------|-----------|
| `hotel-contacts.html` | Upload to your site or open locally. Admin panel to add/edit/delete hotels. |
| `hotel-bulk-template.csv` | Fill with your hotel data. Save as UTF-8. |
| `hotel-bulk-upload.js` | `npm install csv-parser` then `node hotel-bulk-upload.js file.csv` |
| `hotel-bulk-upload.sh` | `bash hotel-bulk-upload.sh file.csv` (Termux-friendly) |
| `README-HOTEL-BULK.md` | Full documentation (setup, troubleshooting, customization) |
| `PRICING-VISUAL-GUIDE.md` | How pricing displays on frontend, examples, strategy |
| `IMPLEMENTATION-CHECKLIST.md` | Step-by-step phases, success criteria |

---

## Pricing Tiers

| Rate | When | Example |
|------|------|---------|
| **Standard** | Jul-Aug, Dec-Mar | ₹2,500/night (baseline) |
| **Peak** | Apr-Jun, Sep-Oct | ₹3,500/night (holidays +40%) |
| **Promo** | Anytime | ₹2,250/night (bulk -10%) |

Leave Peak/Promo blank if not used. Promo auto-fills to 90% of Standard.

---

## CSV Columns

Required: `city`, `name`, `tier`, `rate`  
Optional: `ratePeak`, `rateOff`, `contact`, `rooms`, `photo`, `lat`, `lng`, `location`, `discountNote`

```csv
city,name,tier,location,contact,rate,ratePeak,rateOff,photo,lat,lng,discountNote
shimla,Hotel A,premium,Ridge,9876543210,2500,3500,2250,https://...,31.77,77.17,Offer
```

---

## Firebase Schema

```json
{
  "hotels": {
    "city-slug": {
      "key": {
        "name": "Hotel Name",
        "tier": "premium",
        "rate": 2500,
        "ratePeak": 3500,
        "rateOff": 2250,
        "contact": "9876543210",
        "photo": "https://...",
        "lat": 31.77,
        "lng": 77.17
      }
    }
  }
}
```

---

## Admin UI Preview

**Add/Edit Hotel Form:**
```
Location: [shimla ▼]
Hotel Name: [_____________]
Tier: [⭐ Premium]
Standard Rate: [2500]  ← Required
Peak Rate: [3500]      ← Optional
Promo Rate: [2250]     ← Auto-fills 90% if blank
Contact: [9876543210]
Photo URL: [https://...]
GPS Lat: [31.77]  Lng: [77.17]
[Save]  [Cancel]
```

**Hotel Card Display:**
```
🏨 Hotel Name (⭐ Premium)
Location: The Ridge

[Standard] [Peak]  [Promo]
₹2500      ₹3500   ₹2250
per night  Apr-Jun bulk/loyalty

💬 9876543210  6 rooms  📍 Map

💡 Book 3+ nights: save ₹500/night

[✏️ Edit]  [🗑️ Delete]
```

---

## Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| **Bulk upload HTTP 401** | Check Firebase rules allow POST to `/hotels/` |
| **CSV won't parse** | Save as UTF-8, no quotes unless text has comma |
| **Admin form won't save** | Check browser console for JS errors |
| **Photos not loading** | Use Unsplash (free, no auth): `photo-xxxx?w=400` |
| **GPS not showing** | Check lat/lng are numbers (31.77, not "31.77") |

---

## Firebase Rules (Testing)

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

Change `.write: false` before going live.

---

## What Visitors See

**On Hotel Cards:**
```
Oakville ⭐ Premium
The Ridge, Shimla

Standard: ₹2,500/night
Peak: ₹3,500/night (Apr-Jun, Sep-Oct)
Promo: ₹2,250/night (bulk/loyalty)

💬 WhatsApp  🛏️ 6 rooms  📍 Map
```

---

## Next Steps

1. Copy `hotel-contacts.html` to your site
2. Collect real hotel data (phone, rates, GPS)
3. Fill `hotel-bulk-template.csv`
4. Run bulk upload script
5. Test on live site

---

## Testing Checklist

- [ ] Admin UI loads without JS errors
- [ ] Can add/edit hotel manually
- [ ] Bulk upload completes (✅ success count > 0)
- [ ] Hotels appear in admin list grouped by city
- [ ] Seasonal rates display correctly (Standard/Peak/Promo boxes)
- [ ] WhatsApp links work
- [ ] Maps work (if GPS provided)
- [ ] Promo rate shows with success color (green)

---

**⏱️ Time Estimate:**  
Setup: 15 min | Data entry: 1-2 hours | Bulk upload: 2 min | Testing: 30 min

**📖 Full docs:** See README-HOTEL-BULK.md, PRICING-VISUAL-GUIDE.md, IMPLEMENTATION-CHECKLIST.md
