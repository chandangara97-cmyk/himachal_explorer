HIMACHAL EXPLORER CHATBOT - SETUP
=================================

ZIP CONTENTS (extract into the ROOT of your website repo, the folder with index.html)

  hx-chatbot.js                     -> site root, next to index.html
  _chatbot-setup/PAGES-TO-EDIT.txt  -> checklist of every page (built from your sitemap)
  _chatbot-setup/SNIPPET.html       -> the 4 lines to paste on each page
  _chatbot-setup/add-chatbot.py     -> OPTIONAL automatic helper (needs Python)
  _chatbot-setup/README.txt         -> this file

  (Folders starting with _ are ignored by GitHub Pages' Jekyll build.)

STEP 1 - set your WhatsApp number
  In SNIPPET.html replace 919876543210 with your real number:
  digits only, country code first, no + or spaces.

STEP 2 - add the snippet to every page (pick ONE way)

  A) By hand (no tools): open each file listed in PAGES-TO-EDIT.txt and paste the 4 lines
     of SNIPPET.html on their own lines just above  </body>.  Paste once per page.

  B) VS Code, all pages at once (no Python):
     Ctrl+Shift+H, turn on regex (.*), Search:  </body>
     Replace with one line:
       <!-- hx-chatbot:start -->\n<script>window.HX_CONFIG={whatsapp:"919876543210"};</script>\n<script src="/hx-chatbot.js?v=1" defer></script>\n<!-- hx-chatbot:end -->\n</body>
     Files to include:  **/*.html
     Files to exclude:  admin/**,legacy/**,docs/**,_chatbot-setup/**,sukoon-homestay/**
     Check the match count, Replace All ONCE. (A second run would add the bot twice.)

  D) GitHub Actions (works from a phone browser, nothing to install):
     1. Upload hx-chatbot.js to the repo root (Add file > Upload files).
     2. Add file > Create new file, name it  .github/workflows/add-chatbot.yml  and paste the contents
        of the add-chatbot.yml file from this zip. Commit.
     3. Actions tab > "Add chatbot to all pages" > Run workflow. Enter your WhatsApp number and leave
        "dry_run" ticked first: the run summary lists every page it would change.
     4. Run it again with dry_run UNticked. It edits the pages and commits for you.
     To undo: run it with action = remove.

  C) Python helper (optional):
       python3 _chatbot-setup/add-chatbot.py --whatsapp 919876543210 --dry-run   (preview)
       python3 _chatbot-setup/add-chatbot.py --whatsapp 919876543210             (apply)
     Safe to re-run, keeps encodings and line endings, skips redirect stubs and admin/legacy/docs,
     and skips sukoon-homestay/ (add  --include sukoon-homestay  to include it).
     Undo: python3 _chatbot-setup/add-chatbot.py --remove     (Windows: use  py  instead of  python3)

STEP 3 - commit and push, then open any page (private tab). The orange "Plan your trip"
  button appears in the lower-right corner. If another floating button is already there, add
  offsetBottom to the config line, e.g.  {whatsapp:"91...", offsetBottom:80}

PACKAGES PAGE (packages.html)
  The bot asks ONE question only: "Where will you start?" (Chandigarh / Delhi / Shimla / Other regions),
  then shows the matching packages as a 2-column tile grid (days badge, name, districts covered).
  Each tile opens that package's /pkg/ page. The start point is remembered for the session.
  Start city is read from each package's file name (delhi-..., chandigarh-..., shimla-...).

WHAT THE BOT KNOWS ABOUT YOUR SITE (from your sitemap)
  - Pages: packages, yui (route builder), build-your-trip, plan-your-trip, explore, hotels,
    bike-rental, taxi-service, himachal-treks, booking, about, contact, agent-partner, blog,
    encyclopedia and its sub-pages, 12 district pages, and 19 /pkg/ package pages.
  - District pages are at the site ROOT (/shimla.html). If they also work under /districts/,
    the bot detects whichever one exists.
  - Package suggestions use the real /pkg/ slugs (start city, days, districts). No prices are
    stored; prices stay live on the site. When you add packages, add the slug to PACKAGE_SLUGS
    in hx-chatbot.js.

CHECK AFTER GOING LIVE
  1. Open the browser console (F12). The bot logs a warning for every link it hides because
     the page returned 404. Known one: /group-costing.html is NOT in your sitemap. Tell us which
     page is your cost calculator and set its address in PAGE_REGISTRY (key groupCosting).
  2. Replace the placeholder payment / cancellation / group answers (search "VERIFY").
  3. Each page needs <meta name="viewport" content="width=device-width, initial-scale=1"> in <head>,
     otherwise phones show the desktop layout and the button looks wrong.
  4. After editing hx-chatbot.js, change ?v=1 to ?v=2 in the snippet so phones fetch the new file.
