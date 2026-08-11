# 🏨 Hotel Pricing Display — Quick Visual Guide

## What Visitors See

When users browse hotels on Himachal Explorer, they see **seasonal pricing cards** like this:

```
┌────────────────────────────────────────────┐
│ ⭐ PREMIUM                                  │
│                                            │
│ Woodstock Inn                              │
│ The Ridge, Shimla                          │
│                                            │
│ ┌──────────┬──────────┬──────────┐        │
│ │Standard  │ Peak     │ Promo    │        │
│ │₹2500     │ ₹3500    │ ₹2250    │        │
│ │per night │Apr-Jun   │bulk/     │        │
│ │          │Sep-Oct   │loyalty   │        │
│ └──────────┴──────────┴──────────┘        │
│                                            │
│ 💬 9876543210    6 rooms  📍 Map          │
│                                            │
│ 💡 Book 3+ nights: save ₹500/night        │
│                                            │
│ [✏️ Edit]  [🗑️ Delete]                     │
└────────────────────────────────────────────┘
```

---

## Pricing Tiers Explained

| Tier | When | Use Case |
|------|------|----------|
| **Standard** | Jul-Aug, Dec-Mar | Default B2B rate |
| **Peak** | Apr-Jun, Sep-Oct | Holiday/festival markup (10-30% higher) |
| **Promo** | Anytime | Bulk bookings, loyalty discounts (10-20% lower) |

---

## Admin Interface

When you **edit hotels** in `hotel-contacts.html`, you fill in:

```
Form Fields:
├─ Standard Rate (₹/night) ............ [2500]  ← Required
├─ Peak Season Rate (₹/night) ........ [3500]  ← Optional
├─ Off-Season / Promo Rate (₹/night) . [2250]  ← Auto-fills 90% if blank
├─ Hotel Name ........................ [Woodstock Inn]
├─ Contact Phone ..................... [9876543210]
└─ Location .......................... [The Ridge, Shimla]
```

---

## CSV Bulk Upload Example

**Fill the template** `hotel-bulk-template.csv`:

```csv
city,name,tier,location,contact,rooms,rate,ratePeak,rateOff,photo,lat,lng,discountNote
shimla,Woodstock Inn,premium,"The Ridge, Shimla",9876543210,6,2500,3500,2250,https://images.unsplash.com/...,31.7741,77.1717,Book 3+ nights: save ₹500/night
shimla,Budget Resorts,budget,"Near Scandal Point",9123456789,8,1200,1500,1080,https://images.unsplash.com/...,31.7816,77.1727,
sangla,Kinner Camps,luxury,"Sangla Valley Overlook",8765432101,5,4500,5800,4050,https://images.unsplash.com/...,31.3203,78.5272,Book 2+ nights: free breakfast
```

**Then bulk upload:**

```bash
# Option 1: Node.js (faster)
npm install csv-parser
node hotel-bulk-upload.js hotel-bulk-template.csv

# Option 2: Bash (no dependencies)
bash hotel-bulk-upload.sh hotel-bulk-template.csv
```

---

## Display on Frontend Package Pages

When a package lists a hotel partner, visitors see:

```
🏨 Included Hotel

Woodstock Inn ⭐ Premium
The Ridge, Shimla

📅 Standard Rate: ₹2,500/night (Jul-Aug, Dec-Mar)
📅 Peak Rate: ₹3,500/night (Apr-Jun, Sep-Oct)
📅 Promo Rate: ₹2,250/night (bulk/loyalty)

💬 WhatsApp   🛏️ 6 rooms   📍 Map

Book 3+ nights: save ₹500/night
```

---

## How to Add/Edit Hotels

### **Method 1: Manual (One Hotel at a Time)**

1. Open `hotel-contacts.html` in browser
2. Click **+ Add Hotel**
3. Fill in:
   - Location (pick from dropdown or create new)
   - Hotel name
   - Tier (Budget/Premium/Luxury)
   - **Standard Rate** (required)
   - **Peak Rate** (optional)
   - **Promo Rate** (auto-fills 90% if blank)
   - Contact, GPS, photo, etc.
4. Click **Save** → pushed to Firebase instantly

### **Method 2: Bulk Upload (Many Hotels)**

1. Fill `hotel-bulk-template.csv` with real data
2. Run either:
   ```bash
   node hotel-bulk-upload.js hotel-bulk-template.csv
   # OR
   bash hotel-bulk-upload.sh hotel-bulk-template.csv
   ```
3. Script validates, uploads all to Firebase
4. Refresh admin UI to see them

---

## Real-World Example

You have a hotel in **Shimla**:
- Name: **Hotel Oakville**
- Tier: **Premium**
- Rooms: **8**
- Contact: **9876543210**
- GPS: **31.7741, 77.1717**

### Pricing:
- July-August guests: ₹2,500/night (off-peak, families)
- April-May guests: ₹3,500/night (Himachal Fair, cherry season)
- Corporate bulk (10+ rooms): ₹2,250/night (10% loyalty discount)

### CSV Entry:
```csv
shimla,Hotel Oakville,premium,"Near Mall Road",9876543210,8,2500,3500,2250,https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400,31.7741,77.1717,Corporate bulk rates available
```

### Admin Form:
```
Standard Rate: 2500
Peak Season Rate: 3500
Promo Rate: 2250 (calculated as 2500 × 0.9)
```

### What Users See:
```
Hotel Oakville ⭐
Near Mall Road, Shimla

[Standard] [Peak]  [Promo]
₹2500      ₹3500   ₹2250
per night  Apr-Jun bulk/
           Sep-Oct loyalty

Corporate bulk rates available
```

---

## Auto-Discount Formula

If you **leave Promo Rate blank**, it auto-fills:

```
Promo Rate = Standard Rate × 0.9
```

Example:
- Standard: ₹2500
- Promo auto-fills: ₹2250

You can override manually if needed (e.g., special offer ₹2000).

---

## Seasonal Pricing Strategy

### ✅ Good Pricing

| Rate Type | Amount | Why |
|-----------|--------|-----|
| Standard | ₹2500 | Off-peak baseline |
| Peak | ₹3500 | +40% for Apr-May holidays |
| Promo | ₹2250 | 10% bulk discount |

### ❌ Avoid This

| Rate Type | Amount | Problem |
|-----------|--------|---------|
| Standard | ₹2500 | ✓ |
| Peak | ₹2000 | ✗ Peak should be HIGHER |
| Promo | ₹5000 | ✗ Promo should be LOWER |

---

## Testing Your Prices

1. **Add a test hotel** via admin UI
2. **Open packages page** → see it with seasonal rates
3. **Edit the rates** in admin → instant frontend update
4. **Delete test hotel** when done

---

## FAQ

**Q: What if I don't have peak/promo rates?**
A: Peak and Promo are optional. Leave blank and only Standard shows.

**Q: Can I have different rates by date, not season?**
A: Not yet. Current system is 3-tier seasonal. For daily rates, would need backend logic.

**Q: What if contact number is wrong?**
A: Visitors will get a WhatsApp connection error. Fix in admin UI and re-save.

**Q: Can I bulk-edit all hotels at once?**
A: Not currently. Edit via admin UI individually, or delete all + re-upload CSV.

**Q: Does the peak rate show on booking?**
A: Right now, it's informational only. Actual booking prices are quoted via `chan.html` (costing engine).

---

## Next Steps

1. **Collect real hotel data** (name, phone, GPS, photos)
2. **Fill the CSV template** with your partner hotels
3. **Run bulk upload** once to populate Firebase
4. **Test on your site** to verify seasonal pricing displays
5. **Refine rates** based on real feedback
6. **Add to package pages** as recommended hotels

---

**Built for Himachal Explorer | Seasonal Pricing v1.0**
