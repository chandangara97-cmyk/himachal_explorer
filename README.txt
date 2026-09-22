Himachal Explorer — Layout Fixes
================================

What was fixed
--------------
1. packages.html (mobile)
   - White "Select a package" panel overflowing to the right
   - Horizontal scroll caused by off-screen map/detail panels
   - Fixed by using left:100% + visibility:hidden instead of translateX only

2. Site-wide mobile
   - Bottom nav + "Plan your trip" FAB covering page content
   - Extra padding-bottom and overflow-x:hidden on mobile

3. hx-chatbot.js
   - Floating "Plan your trip" button sat on top of the bottom nav
   - Now automatically lifts to 76px on screens ≤760px

Files to replace (keep the same paths)
--------------------------------------
assets/css/packages.css
assets/css/he-unified.css
hx-chatbot.js

How to apply
------------
1. Download and unzip this archive
2. Copy the three files into your repo root (overwrite existing)
3. Commit and push to GitHub (or deploy via your normal method)

   git add assets/css/packages.css assets/css/he-unified.css hx-chatbot.js
   git commit -m "Fix mobile layout: packages panel overflow + bottom nav/FAB overlap"
   git push

After deploy, hard-refresh on mobile (Ctrl+Shift+R / clear cache) to see the changes.
