# 🔧 Step-by-Step Implementation Guide

## Part A: Automated Find & Replace (Fastest Method)

### For VS Code / Text Editors:

**Open Find & Replace** (Ctrl+H / Cmd+H)

#### Replace 1: Organization Schema Cleanup
**Find**:
```
"name": "Pine & Pass — Chandan's",
```

**Replace With**:
```
"name": "Pine & Pass",
```

**Action**: Replace All

---

#### Replace 2: Meta Author Tags
**Find**:
```
<meta name="author" content="Chandan's — Pine & Pass"/>
```

**Replace With**:
```
<meta name="author" content="Pine & Pass"/>
```

**Action**: Replace All

---

#### Replace 3: Footer Copyright Line
**Find**:
```
© 2026 Pine & Pass. Run by Chandan Panwar.
```

**Replace With**:
```
© 2026 Pine & Pass. All rights reserved.
```

**Action**: Replace All

---

#### Replace 4: Contact Section Heading
**Find**:
```
Plan your journey with<br/><em>Chandan Panwar</em>
```

**Replace With**:
```
Plan your journey with<br/><em>Pine & Pass</em>
```

**Action**: Replace All (or just find — only 1-2 instances)

---

#### Replace 5: WhatsApp "Hi Chandan" Messages
**Find**:
```
Hi Chandan, I want to book
```

**Replace With**:
```
Hi, I want to book a Himachal tour package
```

**Action**: Replace All

---

#### Replace 6: Footer Chandan Attribution
**Find**:
```
Chandan Panwar · +91-7018138847
```

**Replace With**:
```
+91-7018138847 | Pine & Pass
```

**Action**: Replace All

---

## Part B: Manual Critical Fixes (Targeted Edits)

### File 1: index.html

#### Fix 1.1 – Line 20 (Meta Author)
**BEFORE**:
```html
<meta name="author" content="Chandan's — Pine & Pass"/>
```

**AFTER**:
```html
<meta name="author" content="Pine & Pass"/>
```

---

#### Fix 1.2 – Line 58 (Main Organization Schema)
**BEFORE** (search for this block):
```json
"name": "Pine & Pass — Chandan's",
"description": "Curated Himachal Pradesh tour packages...
```

**AFTER**:
```json
"name": "Pine & Pass",
"description": "Curated Himachal Pradesh tour packages...
```

---

#### Fix 1.3 – Line 288 (FAQ Text)
**BEFORE**:
```json
"text": "Yes, all 30 packages are fully customisable for solo travellers, couples, families and groups. WhatsApp or call Chandan's at +91-7018138847 for an instant personalised quote."
```

**AFTER**:
```json
"text": "Yes, all 30 packages are fully customisable for solo travellers, couples, families and groups. WhatsApp +91-7018138847 or call for an instant personalised quote."
```

---

#### Fix 1.4 – Line 360 (Breadcrumb Schema)
**BEFORE**:
```json
"name": "Pine & Pass — Chandan's",
```

**AFTER**:
```json
"name": "Pine & Pass",
```

---

#### Fix 1.5 – Footer (Near end of file)
**BEFORE**:
```html
<div style="margin-top:16px;font-size:11px;color:#4a3820;">
  © 2026 Pine & Pass. Run by Chandan Panwar.
</div>
```

**AFTER**:
```html
<div style="margin-top:16px;font-size:11px;color:#4a3820;">
  © 2026 Pine & Pass. All rights reserved.
</div>
```

---

### File 2: dist_index.html

#### Fix 2.1 – Contact Section Heading
**FIND**:
```html
<h2 class="contact-heading reveal" style="transition-delay:.1s">
  Plan your journey with<br/><em>Chandan Panwar</em>
</h2>
```

**CHANGE TO**:
```html
<h2 class="contact-heading reveal" style="transition-delay:.1s">
  Plan your journey with<br/><em>Pine & Pass</em>
</h2>
```

---

#### Fix 2.2 – Footer in dist_index.html
**FIND & REPLACE**:
Same as index.html footer (Fix 1.5)

---

### File 3: bike-rental.html

#### Fix 3.1 – WhatsApp Contact CTA (Multiple instances)

**BEFORE** (Search for all "Hi Chandan"):
```html
<a href="https://wa.me/917018138847?text=Hi%20Chandan%2C%20I%20want%20to%20book%20a%20Himachal%20tour%20package.">
  Chat with Chandan
</a>
```

**AFTER**:
```html
<a href="https://wa.me/917018138847?text=Hi%2C%20I%20want%20to%20book%20a%20Himachal%20tour%20package.">
  Book via WhatsApp
</a>
```

---

#### Fix 3.2 – Footer
Replace as per Fix 1.5

---

### File 4: explore.html

#### Fix 4.1 – Meta Author
```html
<!-- BEFORE -->
<meta name="author" content="Chandan's — Pine & Pass" />

<!-- AFTER -->
<meta name="author" content="Pine & Pass" />
```

---

#### Fix 4.2 – Footer
Replace as per Fix 1.5

---

### File 5: packages.html

**Search for**: "Chandan's at +91-7018138847"

**Replace with**: "Pine & Pass at +91-7018138847" (or just "+91-7018138847")

---

## Part C: Bulk File Updates (All Pages)

### For ALL .html files:

**Find**: `Chandan's` (apostrophe-s variant)
**Replace**: Remove entirely or replace with "Pine & Pass"

**Find**: `© 2026 Pine & Pass. Run by Chandan Panwar.`
**Replace**: `© 2026 Pine & Pass. All rights reserved.`

---

## Part D: Google Search Console Actions

### Step 1: Update Sitemap
1. Go to GSC > Sitemaps
2. Re-submit sitemap.xml
3. Monitor "Coverage" tab for errors

### Step 2: Request Indexing
1. GSC > URL Inspection
2. Search for key pages (index.html, packages.html, bike-rental.html)
3. Click "Request Indexing" for each

### Step 3: Monitor Changes
1. GSC > Performance
2. Set date filter to "Last 7 days"
3. Watch for traffic recovery

---

## Part E: Verification Checklist

After making changes, verify:

### In Browser DevTools:

```javascript
// Open browser console and run:

// Check 1: Organization name
document.querySelector('script[type="application/ld+json"]')?.textContent
// Should contain: "name": "Pine & Pass" (NOT "Chandan's")

// Check 2: Meta author
document.querySelector('meta[name="author"]')?.content
// Should return: "Pine & Pass"

// Check 3: Footer
document.body.innerText.match(/©.*Pine & Pass/)[0]
// Should NOT contain "Chandan" or "Run by"
```

### Manual SEO Checks:

1. **Title Tags**: Pine & Pass (primary), not Chandan's
2. **Meta Descriptions**: Should reference "Pine & Pass" brand
3. **H1 Tags**: "Pine & Pass" not "Chandan's"
4. **Schema.org**: Single organization with name "Pine & Pass"

---

## Part F: Testing Before Going Live

### Pre-deployment Testing:

1. **Search for 'site:pineandpass.in "Chandan'"** (in Google)
   - Should return 0 results after fix
   - If it returns results, you missed some instances

2. **Check robots.txt & sitemap.xml**
   ```bash
   # Verify no broken URLs
   grep -i "chandan" robots.txt
   grep -i "chandan" sitemap.xml
   # Both should return nothing
   ```

3. **Validate HTML/Schema**:
   - Use https://schema.org/validate (paste schema section)
   - Check https://www.validator.nu/ for HTML errors

---

## Part G: Post-Deployment (First 7 Days)

### Day 1-3: Monitor
- Check Google Search Console for crawl errors
- Verify pages are re-indexed (GSC > Coverage)
- Check Search Results for brand name (site:pineandpass.in)

### Day 4-7: Analyze
- GSC > Performance: Check impressions for "Pine & Pass" query
- Check bounce rate trends
- Monitor "brand" + "non-brand" keyword splits

### Week 2-4: Full Recovery
- Expect 25-40% traffic increase
- Brand rankings should improve
- "Pine & Pass" should rank higher than competitor "Chandan" mentions

---

## Part H: Troubleshooting

### Issue 1: Pages Still Showing Old Content in Google
**Solution**: 
- GSC > Inspect URL > Request Indexing
- Wait 24-48 hours
- If not updated: Submit URL removal, then request re-indexing

### Issue 2: Lost Rankings for Old Brand
**Solution**:
- This is intentional (consolidating to primary brand)
- Monitor "Pine & Pass" keyword recovery
- Should recover within 30 days

### Issue 3: WhatsApp Links Broken
**Solution**:
- URL-encode "+" as "%2B"
- Test each WhatsApp link before going live
- Example: `wa.me/+917018138847`

---

## Summary: Time Estimates

| Task | Time | Files |
|------|------|-------|
| Find & Replace (Automated) | 10 min | All HTML |
| Manual fixes (index.html, dist_index.html) | 20 min | 2 files |
| Other critical files (bike-rental, explore, packages) | 15 min | 3 files |
| GSC submission & testing | 15 min | N/A |
| **Total** | **~60 minutes** | **All** |

---

## Final Pre-Push Checklist

- [ ] All Find & Replace operations complete
- [ ] No instances of "Chandan's — Pine & Pass" remain
- [ ] No instances of "Run by Chandan Panwar" in footers
- [ ] Schema.org validation passes
- [ ] No broken links or 404s
- [ ] Google Search Console sitemap updated
- [ ] Test pages render correctly in browser
- [ ] Meta author tags updated across all pages
- [ ] WhatsApp links tested and working
- [ ] Backup of original files created (just in case)

---

**Ready to deploy?** Once you've completed all changes and passed verification, go live. Monitor Google Search Console closely for the first 7 days.
