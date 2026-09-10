# SEO V2.1 — Master Keyword Index Merge

## What was merged
`himachal_explorer_master_search_index_v2.json` (39,980 English + Hindi search
phrases across all 12 districts) was added to the repo at
`assets/data/search_terms_v2.json` as a reference/source-of-truth vocabulary.
It is not loaded by any page — it's a research asset, not a live feature.

## What was applied now
For each of the 12 district pages, the `<meta name="keywords">` tag was
extended with a curated set of high-intent phrases pulled from the index:
how to reach {district}, best time to visit {district}, {district} tour
package, {district} sightseeing, {district} itinerary, {district} tourist
places, nearest airport to {district}, offbeat places in {district} (plus
distance-from-Delhi/Chandigarh and 2/3-day variants where present in the
index). Only terms not already covered were added — nothing was removed.

Template-y long-tail terms (e.g. "camping in X", "cafes in X", "bus to X")
were deliberately NOT dumped into meta keywords — that tag carries no ranking
weight today and stuffing it looks spammy to anyone who views source. The
real value of those terms is in on-page content.

## Recommended next steps (not yet done)
- Weave 2-3 of the highest-intent phrases per district naturally into the
  visible body copy / H2s / FAQ blocks of each district page (this is what
  actually affects ranking).
- Use the district-filtered term lists to seed new encyclopedia entries or
  blog posts for places that appear often in the index but have no page yet.
- If a real on-site search/autocomplete is ever built, `search_terms_v2.json`
  is the vocabulary to back it — but it should be paired with actual place
  data (Firebase) and URLs, not served as a flat suggestion list, since 40k
  raw strings with no destination would hurt UX more than help.
