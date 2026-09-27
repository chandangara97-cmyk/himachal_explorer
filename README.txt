Himachal Explorer — Encyclopedia enhancement pack
================================================

Files included
--------------
assets/js/encyclopedia.js     Shared engine (filters, sort, search, skeleton)
assets/css/encyclopedia.css   Toolbar, chips, improved CSS Grid, skeleton
encyclopedia-*.html           9 category pages wired to the shared assets
README.txt                    This file

What changed
------------
• District filter chips (auto-built from data)
• Type filter chips
• Sort: Name A–Z | District | Altitude ↑ | Altitude ↓
• Search by name, district, type, or keyword in facts
• Live result count (“Showing 9 of 16”)
• Skeleton loading cards
• Clear-filters button on empty state
• CSS Grid: auto-fit + min(280px,100%) + fluid gap (no overflow on mobile)
• Slightly denser columns on viewports ≥1200px

How to install
--------------
1. Copy assets/js/encyclopedia.js   →  your repo’s assets/js/
2. Copy assets/css/encyclopedia.css →  your repo’s assets/css/
3. Replace each encyclopedia-*.html in the repo root with the matching
   file from this folder (or merge if you have local edits)

After deploy, hard-refresh a category page (e.g. encyclopedia-lakes.html)
and you should see the new toolbar + chips.

Category → Firebase key mapping
-------------------------------
encyclopedia-lakes.html         lakes_reservoirs
encyclopedia-rivers.html        rivers_and_tributaries
encyclopedia-hot-springs.html   hot_springs_waterfalls_kunds
encyclopedia-glaciers.html      glaciers
encyclopedia-valleys.html       valleys
encyclopedia-passes.html        mountain_passes_and_jots
encyclopedia-trek-routes.html   trekking_routes
encyclopedia-conservation.html  environment_and_conservation
encyclopedia-history.html       historical_social_reference_content
