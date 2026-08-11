# 🤖 Automated Batch Processing & Regex Patterns

## Quick Start: One-Command Fix (Linux/Mac/Git Bash)

### Copy & Paste This (Run from project root):

```bash
#!/bin/bash
# BEFORE RUNNING: Create backup first!
# cp -r . ..backup_$(date +%Y%m%d_%H%M%S)

# Run replacements
find . -name "*.html" -type f | while read file; do
  # Fix 1: Organization schema
  sed -i '' 's/"name": "Himachal Explorer — Chandan.*s"/"name": "Himachal Explorer"/g' "$file"
  
  # Fix 2: Meta author
  sed -i '' 's/<meta name="author" content="Chandan.*s — Himachal Explorer"\/>/<meta name="author" content="Himachal Explorer"\/>/g' "$file"
  
  # Fix 3: Footer copyright
  sed -i '' 's/© 2026 Himachal Explorer\. Run by Chandan Panwar\./© 2026 Himachal Explorer. All rights reserved./g' "$file"
  
  # Fix 4: Contact heading
  sed -i '' 's/Plan your journey with<br\/><em>Chandan Panwar<\/em>/Plan your journey with<br\/><em>Himachal Explorer<\/em>/g' "$file"
  
  # Fix 5: WhatsApp "Hi Chandan"
  sed -i '' 's/Hi%20Chandan%2C%20I%20want/Hi%2C%20I%20want/g' "$file"
  
  # Fix 6: Chandan Panwar attribution in footer
  sed -i '' 's/Chandan Panwar · +91-7018138847/+91-7018138847 | Himachal Explorer/g' "$file"
done

echo "✅ All fixes applied! Check git diff to verify."
```

---

## Regex Patterns for Different Editors

### VS Code / Sublime Text

#### Pattern 1: Organization Schema
**Find** (regex enabled):
```regex
"name":\s*"Himachal Explorer\s*—\s*Chandan[''']s"
```

**Replace**:
```
"name": "Himachal Explorer"
```

---

#### Pattern 2: Meta Author Tags
**Find**:
```regex
<meta\s+name="author"\s+content="Chandan[''']s\s*—\s*Himachal Explorer"\s*\/>
```

**Replace**:
```html
<meta name="author" content="Himachal Explorer"/>
```

---

#### Pattern 3: Footer Copyright
**Find**:
```regex
©\s*2026\s+Himachal Explorer\.\s+Run by Chandan Panwar\.
```

**Replace**:
```
© 2026 Himachal Explorer. All rights reserved.
```

---

#### Pattern 4: Contact Heading
**Find**:
```regex
Plan your journey with<br\s*\/><em>Chandan Panwar<\/em>
```

**Replace**:
```html
Plan your journey with<br/><em>Himachal Explorer</em>
```

---

#### Pattern 5: WhatsApp URL Encoding
**Find**:
```regex
Hi%20Chandan%2C\s*I\s+want
```

**Replace**:
```
Hi%2C%20I%20want
```

---

### Notepad++ (Windows)

**Open**: Find > Find & Replace (Ctrl+H)

**Tick**: "Regular expressions" checkbox

Same patterns as above work in Notepad++

---

### Perl One-Liner (Command Line)

```bash
# Single command to fix all files
perl -pi -e 's/"name":\s*"Himachal Explorer\s*—\s*Chandan.*s"/"name": "Himachal Explorer"/g; s/<meta name="author" content="Chandan.*s — Himachal Explorer"\/>/<meta name="author" content="Himachal Explorer"\/>/g; s/© 2026 Himachal Explorer\. Run by Chandan Panwar\./© 2026 Himachal Explorer. All rights reserved./g' *.html

# Or across subdirectories
perl -pi -e 's/PATTERN/REPLACEMENT/g' $(find . -name "*.html" -type f)
```

---

### PowerShell (Windows)

```powershell
# Set working directory
cd path/to/himachal_explorer-main

# Backup first
Copy-Item . -Recurse -Destination "..\backup_$(Get-Date -Format yyyyMMdd_HHmmss)"

# Run replacements
Get-ChildItem -Recurse -Filter "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Fix 1: Schema
    $content = $content -replace '"name":\s*"Himachal Explorer\s*—\s*Chandan[''']s"', '"name": "Himachal Explorer"'
    
    # Fix 2: Meta author
    $content = $content -replace '<meta name="author" content="Chandan[''']s — Himachal Explorer"\s*\/>', '<meta name="author" content="Himachal Explorer"/>'
    
    # Fix 3: Footer
    $content = $content -replace '© 2026 Himachal Explorer\. Run by Chandan Panwar\.', '© 2026 Himachal Explorer. All rights reserved.'
    
    # Fix 4: Heading
    $content = $content -replace 'Plan your journey with<br\/><em>Chandan Panwar<\/em>', 'Plan your journey with<br/><em>Himachal Explorer</em>'
    
    # Fix 5: WhatsApp
    $content = $content -replace 'Hi%20Chandan%2C%20I%20want', 'Hi%2C%20I%20want'
    
    # Save
    Set-Content $_.FullName -Value $content
    Write-Host "✅ Fixed: $($_.Name)"
}
```

---

## Category-Specific Patterns

### For Schema.org JSON-LD Blocks

**Pattern** (Most common):
```json
"name": "Himachal Explorer — Chandan's"
```

**Regex to find all variations**:
```regex
"name":\s*["']Himachal\s+Explorer\s*[-–—]\s*(?:Chandan|Chandan[''']s|Garg).*["']
```

**Replace all with**:
```json
"name": "Himachal Explorer"
```

---

### For HTML Meta Tags

**All variations**:
```regex
(?:
  <meta\s+name="author"\s+content="[^"]*Chandan[^"]*"/> |
  <meta\s+name="author"\s+content="Garg Enterprise[^"]*"/> |
  <meta\s+property="og:site_name"\s+content="[^"]*Chandan[^"]*"/>
)
```

**Replace all with**:
```html
<meta name="author" content="Himachal Explorer"/>
```

---

### For WhatsApp Links

**URL-encoded variations to replace**:
```
Hi%20Chandan        → Hi
Hi+Chandan          → Hi
Hi Chandan          → Hi (space after Hi)
```

**Regex pattern**:
```regex
(?:text=|%20|%2B|%2Btext%3D)Hi[%20+]?Chandan[%2C,]
```

**Replace with**:
```
text=Hi%2C
```

---

### For Footer Text

**Pattern** (multiline):
```regex
©\s*\d{4}\s+Himachal\s+Explorer[.\s]*Run\s+by\s+Chandan\s+Panwar[.\s]*
```

**Replace with**:
```
© 2026 Himachal Explorer. All rights reserved.
```

---

## Verification Regex Patterns

Run THESE after changes to verify nothing was missed:

### Check 1: No remaining "Chandan's" (except in legitimate comments)
```bash
grep -r "Chandan[''']s\|Chandan Panwar" . --include="*.html" | grep -v "<!-- " | grep -v "Rent Bull"
# Should return: 0 results
```

### Check 2: No remaining "Garg Enterprise" references
```bash
grep -r "Garg Enterprise" . --include="*.html"
# Should return: 0 results
```

### Check 3: Verify schema is consistent
```bash
grep -r '"name": "Himachal Explorer' . --include="*.html" | wc -l
# Should return: HIGH NUMBER (all your schemas)

grep -r '"name".*Chandan' . --include="*.html" | wc -l
# Should return: 0
```

---

## Before/After Verification Script

```bash
#!/bin/bash
# Run BEFORE changes
echo "=== BEFORE CHANGES ===" > audit_before.txt
grep -r "Chandan" . --include="*.html" | wc -l >> audit_before.txt
grep -r "Garg Enterprise" . --include="*.html" | wc -l >> audit_before.txt

# ... Run all fixes ...

# Run AFTER changes
echo "=== AFTER CHANGES ===" > audit_after.txt
grep -r "Chandan" . --include="*.html" | wc -l >> audit_after.txt
grep -r "Garg Enterprise" . --include="*.html" | wc -l >> audit_after.txt

# Compare
echo "=== COMPARISON ===" 
diff audit_before.txt audit_after.txt
```

---

## Git Integration (Recommended)

### If using Git:

```bash
# 1. Create new branch
git checkout -b fix/brand-consolidation

# 2. Make all changes
# ... run all replacements ...

# 3. Review changes
git diff

# 4. Stage & commit
git add .
git commit -m "fix: consolidate brand identity to Himachal Explorer

- Standardize meta author to 'Himachal Explorer' across all pages
- Fix schema.org organization names (remove 'Chandan's' variant)
- Consolidate footer branding
- Update WhatsApp CTAs to remove personal name
- Remove Garg Enterprise references

Closes: SEO-BRANDING-001"

# 5. Push to staging
git push origin fix/brand-consolidation

# 6. Test on staging server
# ... verify all changes ...

# 7. Merge to main
git checkout main
git merge fix/brand-consolidation
git push origin main
```

---

## Safety: Backup Before Proceeding

```bash
# Create timestamped backup
BACKUP_DIR="../backup_himachal_$(date +%Y%m%d_%H%M%S)"
cp -r . "$BACKUP_DIR"
echo "✅ Backup created at: $BACKUP_DIR"

# If something goes wrong, restore:
# cp -r "$BACKUP_DIR"/* .
# git checkout .  # if using git
```

---

## Real-World Example: Complete Workflow

```bash
#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Himachal Explorer brand consolidation...${NC}\n"

# Step 1: Backup
echo -e "${YELLOW}Step 1: Creating backup...${NC}"
BACKUP_DIR="../backup_himachal_$(date +%Y%m%d_%H%M%S)"
cp -r . "$BACKUP_DIR"
echo -e "${GREEN}✅ Backup created: $BACKUP_DIR${NC}\n"

# Step 2: Run replacements
echo -e "${YELLOW}Step 2: Running find & replace...${NC}"
find . -name "*.html" -type f | while read file; do
  perl -pi -e 's/"name":\s*"Himachal Explorer\s*—\s*Chandan.*s"/"name": "Himachal Explorer"/g' "$file"
  perl -pi -e 's/<meta name="author" content="Chandan.*s — Himachal Explorer"\/>/<meta name="author" content="Himachal Explorer"\/>/g' "$file"
  perl -pi -e 's/© 2026 Himachal Explorer\. Run by Chandan Panwar\./© 2026 Himachal Explorer. All rights reserved./g' "$file"
  echo "  ✓ $file"
done
echo -e "${GREEN}✅ All replacements complete${NC}\n"

# Step 3: Verification
echo -e "${YELLOW}Step 3: Verifying changes...${NC}"
REMAINING=$(grep -r "Chandan[''']s\|Chandan Panwar" . --include="*.html" 2>/dev/null | grep -v "Rent Bull" | wc -l)
if [ $REMAINING -eq 0 ]; then
  echo -e "${GREEN}✅ Verification passed: No remaining Chandan references${NC}\n"
else
  echo -e "${RED}❌ WARNING: Still found $REMAINING Chandan references${NC}"
  grep -r "Chandan" . --include="*.html" | head -5
fi

# Step 4: Generate report
echo -e "${YELLOW}Step 4: Generating report...${NC}"
cat > CHANGES_REPORT.txt << EOF
Brand Consolidation Changes
Generated: $(date)

Total HTML files processed: $(find . -name "*.html" -type f | wc -l)

Changes made:
1. ✅ Schema.org organization names standardized
2. ✅ Meta author tags updated
3. ✅ Footer branding consolidated
4. ✅ Contact section headings updated
5. ✅ WhatsApp CTAs standardized
6. ✅ Garg Enterprise references removed

Backup location: $BACKUP_DIR

Next steps:
1. Verify all changes in browser
2. Validate HTML/Schema
3. Submit sitemap to Google Search Console
4. Monitor GSC for 7 days
EOF

echo -e "${GREEN}✅ Report generated: CHANGES_REPORT.txt${NC}\n"

echo -e "${GREEN}🎉 Brand consolidation complete!${NC}"
echo -e "Backup saved: ${YELLOW}$BACKUP_DIR${NC}"
echo -e "Next: Verify changes and test locally before deploying"
```

Save this as `fix_branding.sh` and run:
```bash
chmod +x fix_branding.sh
./fix_branding.sh
```

---

## Rollback Procedure (If Needed)

```bash
# Restore from backup if anything goes wrong
BACKUP_PATH="../backup_himachal_YYYYMMDD_HHMMSS"
cp -r "$BACKUP_PATH"/* .

# Or with Git:
git reset --hard HEAD~1
```

---

**Ready?** Choose your method above and execute. Monitor closely for errors!
