HIMACHAL EXPLORER CHATBOT - SETUP (5 minutes)
==============================================

WHAT IS IN THIS ZIP
  hx-chatbot.js                     -> goes in the SITE ROOT, next to index.html
  _chatbot-setup/add-chatbot.py     -> helper that adds the bot to every page (not part of the website)
  _chatbot-setup/README.txt         -> this file

Folder layout after you extract the zip into your repo:

  your-repo/
    index.html
    hx-chatbot.js                   <-- new
    packages.html, booking.html, ...
    districts/kullu.html, ...
    blog/, pkg/, tools/ ...
    _chatbot-setup/                 <-- new (folders starting with _ are ignored by GitHub Pages' Jekyll build)
      add-chatbot.py
      README.txt

STEPS
1. Extract this zip INTO the root of your website repo (the folder that has index.html).
   hx-chatbot.js must end up next to index.html.

2. Open a terminal in that folder and preview (nothing is written):
      python3 _chatbot-setup/add-chatbot.py --whatsapp 91XXXXXXXXXX --dry-run
   Use your real number: digits only, country code first (e.g. 919876543210).
   On Windows use  py  instead of  python3.

3. Apply:
      python3 _chatbot-setup/add-chatbot.py --whatsapp 91XXXXXXXXXX

4. Commit and push. Open any page (also a page inside /districts/, /blog/, /pkg/):
   you should see the orange "Plan your trip" button bottom-right.

WHAT THE HELPER DOES
  - Adds this block just before </body> on every .html page, including pages in sub-folders:
        <!-- hx-chatbot:start -->
        <script>window.HX_CONFIG={whatsapp:"91..."};</script>
        <script src="/hx-chatbot.js?v=..." defer></script>
        <!-- hx-chatbot:end -->
    The path starts with "/" so it is correct from every folder depth on your custom domain.
  - Safe to re-run: an existing block is updated, never duplicated. Re-run it after you edit
    hx-chatbot.js so the ?v= number changes and phones/the Android app fetch the new file.
  - Keeps each file's encoding and line endings exactly as they were.
  - SKIPS: redirect stub pages (meta refresh), partial include files with no </body>,
    and the folders admin, legacy, docs, android, app, build, dist, vendor, node_modules, .git.
    Add more with  --skip foldername  (repeatable).
  - Undo everything:  python3 _chatbot-setup/add-chatbot.py --remove

IF THE SITE IS NOT ON A CUSTOM DOMAIN ROOT
  If it is served from  username.github.io/repo-name/  add:  --base /repo-name/
  (your site uses a CNAME, so the default "/" should be right.)

THINGS TO CHECK AFTER GOING LIVE
  1. Open the browser console (F12) on a page. The bot logs a warning for every link it had to hide
     because the target page returned 404 (for example /yui.html or /group-costing.html if those
     names differ from your real files). Fix the names in PAGE_REGISTRY inside hx-chatbot.js.
  2. Replace the placeholder payment / cancellation / group answers near the top of hx-chatbot.js
     (search for "VERIFY") with your real terms.
  3. New pages you add later: run the helper again (or paste the block above by hand).
  4. Pages in /pkg/ are treated as package pages, and /tools/ pages get generic greetings.
     Tell us if those folders hold something different.
