# Partner Desk setup (free, Firebase Spark plan)

Files: `agent-partner.html`, `agent-admin.html`, `partner-config.js`, `firestore.rules.agent-portal.txt`

## 1. Firebase (10 minutes)
1. console.firebase.google.com > open the same project your website already uses.
2. Build > Authentication > Sign-in method > enable **Email/Password**.
3. Project settings (gear) > Your apps > Web app > copy the config values (apiKey, authDomain, projectId, appId).
4. Build > Firestore Database > Rules > merge everything from `firestore.rules.agent-portal.txt` into your rules > Publish.
5. Make yourself admin:
   - Authentication > Users > Add user > your own real email + a strong password. Copy the **User UID**.
   - Firestore > Start collection `admins` > Document ID = that UID > add field `role` (string) = `owner` > Save.

## 2. Settings file
Open `partner-config.js` and fill:
- `firebase` keys from step 1.3
- `whatsappNumber` = your WhatsApp as `91XXXXXXXXXX`
- `gateways` and `tiers` = the exact names used in your Firebase package pricing
- `levels` = your real commission % and conditions (10/12/15 are placeholders)

## 3. Upload
Put `agent-partner.html`, `agent-admin.html`, `partner-config.js` in the site root, next to `packages.html`.
Keep the admin URL private (it is set to noindex; do not link it anywhere).

## 4. Connect your pricing engine
In `agent-partner.html`, `PricingEngine.getRetail(pkg, tier, gateway)` is the one hook.
It currently reads `pkg.pricing[gateway][tier]`. If your Firebase packages store prices differently, change only that function.

## 5. Test the whole flow once
1. Open `agent-partner.html` on your phone > Apply as partner > fill name, mobile, city > WhatsApp opens > Send.
2. Open `agent-admin.html` > log in > New applications > Approve > Create login > Send on WhatsApp.
3. Log in on `agent-partner.html` with that mobile number and password. Check a few prices against packages.html.

## 6. Put the link on your index page (quietly)
Customers should not feel it is aimed at them, so it goes in the footer as small, muted text, next to Privacy / Terms. Never in the main menu or hero.

Recommended (best for Google, plain HTML): paste this inside the `<footer>` of `index.html`:

```html
<p style="text-align:center;margin:0;padding:10px 16px 18px;font-size:.8rem">
  <a href="/agent-partner.html" title="For travel agents and partners"
     style="color:inherit;opacity:.6;text-decoration:none;border-bottom:1px dotted currentColor">Travel agent partner login</a>
</p>
```

Quick way for every page at once: upload `partner-link.js` and add this line before `</body>` on each page (or in your shared footer/template):

```html
<script src="/partner-link.js" defer></script>
```

It adds the same small link to the footer, skips itself if the link already exists, and hides when printing.

## 7. Go live for Google
- The footer link above is what lets Google find the page.
- Add `https://himachalexplorer.in/agent-partner.html` to `sitemap.xml`. Do not add the admin page.
- Search Console > URL Inspection > paste the URL > Request indexing.
- Google indexes only the public part (levels, calculator, FAQ). Package prices stay behind login.

## Daily use
- New agent: approve in `agent-admin.html`, send the password on WhatsApp. Agents can change it via "Change password".
- Special rate for one package: Firestore > `agent_rates` > Document ID = package id > field `commission_pct` = number.
- Change level or pause an agent: Approved partners tab.
- Forgot password: Partners tab > "New login". First delete that number's old login in Authentication.

## Free plan limits
Spark plan: Email/Password auth is free, Firestore has a daily free quota (check the Firebase pricing page for current numbers). Nothing here uses Cloud Functions, SMS or WhatsApp API.

## Notes
- Passwords must be 6+ characters (Firebase rule). `HP123` is too short.
- Firebase web keys in `partner-config.js` are not secret. Your Firestore rules are what protect the data.
- Agents' mobile numbers map internally to `<number>@agents.himachalexplorer.in` (not a real mailbox).
