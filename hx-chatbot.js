/*!
 * Himachal Explorer Assistant v2 — rule-based, no API, no cost.
 * Install: <script src="/hx-chatbot.js" defer></script> before </body> on every page.
 *
 * Architecture (matches the spec):
 *   PAGE_REGISTRY  -> single source of truth for URLs (FAQ records reference pageKeys, never raw URLs)
 *   FAQ records    -> question, answer, pageContext, intent, next, resolution, related, priority, enabled, live
 *   5 resolution types -> answer | page | tool | recommend | human
 *   Journey memory -> interest, duration, startPoint, season, intent (kept in sessionStorage across pages)
 *   Link validation-> registry URLs are HEAD-checked on first open; dead links are hidden and logged
 *   Position       -> always bottom-right. To lift it above another floating button: window.HX_CONFIG = { offsetBottom: 80 }
 *   AI fallback    -> optional: window.HX_CONFIG.aiFallback = async (text, session) => "reply html"
 */
(function () {
  "use strict";

  /* ================= 1. CONFIG ================= */
  var HX = window.HX_CONFIG || {};
  var CFG = {
    brand: "Himachal Explorer",
    whatsapp: HX.whatsapp || "91XXXXXXXXXX", // digits only incl. country code
    aiFallback: HX.aiFallback || null,
    validateLinks: HX.validateLinks !== false,
    // VERIFY these policy answers before launch
    payment: "Payment terms are written into your quotation before you confirm anything. Ask our team on WhatsApp for the exact schedule for your trip.",
    cancel: "Cancellation and refund terms depend on the package, season and hotels involved, and are stated in your written quotation. Ask us on WhatsApp before you pay.",
    group: "Yes, we plan group, family and corporate trips. Share your group size and dates and we will quote it."
  };

  /* ================= 2. PAGE REGISTRY =================
   * URLs below come from earlier discussions of the site structure.
   * They are validated live (see validateRegistry) so the bot never links to a 404.
   * Keys of the form "district:kullu" resolve to /districts/kullu.html automatically. */
  var PAGE_REGISTRY = {
    home: { url: "/", label: "Explore Himachal" },
    packages: { url: "/packages.html", label: "View Tour Packages" },
    routeBuilder: { url: "/yui.html", label: "Open Route Builder" },
    buildYourTrip: { url: "/build-your-trip.html", label: "Build Your Trip" },
    planYourTrip: { url: "/plan-your-trip.html", label: "Plan Your Trip" },
    explore: { url: "/explore.html", label: "Explore Himachal" },
    encyclopedia: { url: "/encyclopedia.html", label: "Explore Encyclopedia" },
    hotels: { url: "/hotels.html", label: "Browse Hotels & Stays" },
    bikeRental: { url: "/bike-rental.html", label: "Bike Rental" },
    taxi: { url: "/taxi-service.html", label: "Taxi Service" },
    treks: { url: "/himachal-treks.html", label: "Explore Treks" },
    groupCosting: { url: "/group-costing.html", label: "Calculate Trip Cost" }, // NOT in sitemap: hidden automatically if it 404s
    booking: { url: "/booking.html", label: "Go to Booking" },
    contact: { url: "/contact.html", label: "Contact Travel Expert" },
    about: { url: "/about.html", label: "About Us" },
    agent: { url: "/agent-partner.html", label: "Agent & Partner Page" },
    blog: { url: "/blog/index.html", label: "Read Travel Guides" }
  };

  var DISTRICTS = {
    bilaspur: { name: "Bilaspur", best: "Oct to Mar", pts: "Gobind Sagar lake, Naina Devi temple, Bhakra dam", tags: ["relax", "spiritual"] },
    chamba: { name: "Chamba", best: "Mar to Jun and Sep to Nov", pts: "Khajjiar, Dalhousie, Chamba temples, Lama Dal, Mahakali and Chhadasaru lakes", tags: ["spiritual", "adventure", "relax"] },
    hamirpur: { name: "Hamirpur", best: "Oct to Mar", pts: "Sujanpur Tira fort and gardens, Beas riverside at Nadaun", tags: ["relax"] },
    kangra: { name: "Kangra", best: "Mar to Jun and Sep to Nov", pts: "Dharamshala, McLeodganj, Bir Billing, Kangra Fort, Baijnath temple", tags: ["spiritual", "adventure", "relax"] },
    kinnaur: { name: "Kinnaur", best: "May to Oct", pts: "Kalpa, Sangla, Chitkul, Nako", tags: ["adventure", "snow"] },
    kullu: { name: "Kullu", best: "Mar to Jun for weather, Dec to Feb for snow", pts: "Manali, Kasol and Parvati Valley, Naggar, Solang, Atal Tunnel", tags: ["adventure", "snow", "relax"] },
    mandi: { name: "Mandi", best: "Mar to Jun and Sep to Nov", pts: "Rewalsar Lake, Prashar Lake, Barot valley", tags: ["spiritual", "adventure"] },
    shimla: { name: "Shimla", best: "Mar to Jun, and Dec to Feb for snow", pts: "Mall Road, Ridge, Kufri, Narkanda, Naldehra", tags: ["snow", "relax"] },
    sirmour: { name: "Sirmour", best: "Sep to Mar", pts: "Renuka Lake, Paonta Sahib, Nahan, Churdhar", tags: ["spiritual", "relax"] },
    solan: { name: "Solan", best: "Sep to Jun", pts: "Kasauli, Barog, Chail", tags: ["relax"] },
    spiti: { name: "Spiti", best: "Jun to Oct", pts: "Kaza, Key Monastery, Kibber, Tabo, Dhankar, Chandratal, Suraj Tal", tags: ["adventure", "spiritual"] },
    una: { name: "Una", best: "Oct to Mar", pts: "Chintpurni temple, Swan river area", tags: ["spiritual"] }
  };

  Object.keys(DISTRICTS).forEach(function (id) { DISTRICTS[id].url = "/" + id + ".html"; }); // sitemap lists districts at the site root

  var dead = {}; // pageKeys that failed validation

  function resolveKey(key) {
    if (!key) return null;
    if (key.indexOf("district:") === 0) {
      var id = key.slice(9);
      return DISTRICTS[id] ? { url: DISTRICTS[id].url, label: DISTRICTS[id].name + " Guide" } : null;
    }
    var p = PAGE_REGISTRY[key];
    return p && !dead[key] ? p : null;
  }
  function link(key, label) {
    var p = resolveKey(key);
    return p ? { label: label || p.label, href: p.url } : null;
  }
  function validateRegistry() {
    if (!CFG.validateLinks || !window.fetch || location.protocol === "file:") return;
    Object.keys(PAGE_REGISTRY).forEach(function (k) {
      fetch(PAGE_REGISTRY[k].url, { method: "HEAD" }).then(function (r) {
        if (r.status === 404) { dead[k] = true; console.warn("[hx-chatbot] Dead registry link hidden:", k, PAGE_REGISTRY[k].url); }
      }).catch(function () { /* offline or blocked: assume ok */ });
    });
    Object.keys(DISTRICTS).forEach(function (id) {
      var head = function (u) { return fetch(u, { method: "HEAD" }); };
      head(DISTRICTS[id].url).then(function (r) {
        if (r.status !== 404) return;
        head("/districts/" + id + ".html").then(function (r2) {
          if (r2.status === 404) { delete DISTRICTS[id]; console.warn("[hx-chatbot] District page not found at root or /districts/:", id); }
          else { DISTRICTS[id].url = "/districts/" + id + ".html"; }
        }).catch(function () {});
      }).catch(function () {});
    });
  }

  /* Page detector: URL -> page context key used by FAQ.pageContext */
  var PAGE_PATTERNS = [
    { re: new RegExp("^\\/(?:districts\\/)?(" + Object.keys(DISTRICTS).join("|") + ")\\.html$"), type: "district" },
    { re: /package-detail|\/pkg\//, type: "package-detail" },
    { re: /packages/, type: "packages" },
    { re: /yui\.html|route-builder|build-your-trip|plan-your-trip|trip-gate/, type: "route-builder" },
    { re: /group-costing|costing|calculator/, type: "costing" },
    { re: /booking/, type: "booking" },
    { re: /hotels/, type: "hotels" },
    { re: /bike-rental/, type: "bike" },
    { re: /taxi-service/, type: "taxi" },
    { re: /himachal-treks/, type: "treks" },
    { re: /contact/, type: "contact" },
    { re: /agent-partner/, type: "agent" },
    { re: /about/, type: "about" },
    { re: /\/blog\//, type: "blog" },
    { re: /encyclopedia|dist_master|explore|options/, type: "encyclopedia" },
    { re: /^\/(index\.html|home\.html)?$/, type: "home" }
  ];
  var GREETINGS = {
    home: "Hi! Planning a Himachal trip? I can suggest a route, answer questions, or connect you with our team.",
    packages: "Looking at packages? Prices here are live, so they are always current. I can help you compare or choose.",
    "package-detail": "Checking a package? I can explain what is usually included or help you customize it.",
    "route-builder": "Building a route? Tell me your start point and days and I will suggest where to go.",
    costing: "Working out a cost? I can explain what changes the price, or send your numbers to our team.",
    booking: "Ready to book? I can answer questions about the process before you submit.",
    contact: "Need to reach us? WhatsApp is the fastest way. Or ask me something first.",
    about: "Welcome! Ask me anything about " + CFG.brand + " or start planning a trip.",
    blog: "Reading our guides? I can turn what you read into a trip plan.",
    hotels: "Looking for a stay? Tell me your dates and area and I can point you to options or check with our team.",
    bike: "Thinking of a bike trip? I can help with routes, seasons and what to plan for.",
    taxi: "Need a taxi? Tell me your route and dates and I can connect you with our team for a quote.",
    treks: "Interested in trekking? I can help you pick a trek by season and difficulty.",
    agent: "Are you a travel agent or partner? Ask me about working with " + CFG.brand + ".",
    encyclopedia: "Exploring destinations? Ask about any place, or tell me your dates and interests and I will narrow it down.",
    fallback: "Hi! I am the " + CFG.brand + " assistant. How can I help?"
  };

  /* ================= 3. FAQ DATABASE =================
   * Record: id, q, a, kw (matching), ctx (pageContext), intent, next (suggestedNextQuestions),
   *         res {type, pageKey, label}, rel [{pageKey,label}], pri (priority), on (enabled), live (needs live data)
   * res.type: answer | page | tool | recommend | human | action */
  var FAQ = [];
  function F(id, q, a, o) {
    o = o || {};
    FAQ.push({
      id: id, q: q, a: a, kw: o.kw || [], ctx: o.ctx || [], intent: o.intent || id,
      next: o.next || [], res: o.res || { type: "answer" }, rel: o.rel || [],
      pri: o.pri == null ? 5 : o.pri, on: o.on !== false, live: !!o.live
    });
  }
  function byId(id) { for (var i = 0; i < FAQ.length; i++) if (FAQ[i].id === id) return FAQ[i]; return null; }

  // Actions (not answers; handled by the engine)
  F("plan", "Plan my trip", "", { res: { type: "action" }, ctx: ["home", "packages", "contact", "about", "blog", "encyclopedia", "route-builder", "district"], pri: 10, kw: ["plan my trip", "plan a trip", "suggest a trip", "help me plan"] });
  F("whatsapp", "Talk to a travel expert", "", { res: { type: "action" }, pri: 9 });
  F("d-best", "Best time for this district", "", { res: { type: "action" }, ctx: ["district"], pri: 10 });
  F("d-see", "What to see here", "", { res: { type: "action" }, ctx: ["district"], pri: 9 });

  // Type 3: interactive tools
  F("route-builder", "Can I create my own Himachal itinerary?",
    "Yes. You can build a customized itinerary by choosing your starting point, destinations and trip length.",
    { kw: ["own itinerary", "build itinerary", "create itinerary", "route builder", "custom route", "make a route", "itinerary"], ctx: ["home", "packages", "route-builder", "encyclopedia"], intent: "build_custom_itinerary",
      next: ["start-where", "how-many-days", "cost-calc"], res: { type: "tool", pageKey: "routeBuilder", label: "Open Route Builder" }, rel: [{ pageKey: "packages", label: "Explore Tour Packages" }, { pageKey: "groupCosting", label: "Calculate Trip Cost" }], pri: 10 });
  F("cost-calc", "How much will my trip cost?",
    "Cost depends on season, hotel category, vehicle and group size. Use the calculator for an estimate. I don't quote fixed numbers here because live prices change.",
    { kw: ["price", "cost", "how much", "budget", "rate", "cheap", "expensive", "estimate", "calculate"], ctx: ["home", "packages", "package-detail", "costing", "route-builder", "booking"], intent: "estimate_cost", live: true,
      next: ["inclusions", "customize", "whatsapp"], res: { type: "tool", pageKey: "groupCosting", label: "Calculate Your Trip" }, rel: [{ pageKey: "packages", label: "Compare Packages" }, { pageKey: "buildYourTrip" }], pri: 10 });
  F("start-where", "Where should I start my journey?",
    "Most travellers start from Chandigarh or Delhi and continue by road. Your start point decides which circuits are practical in your days.",
    { kw: ["start point", "where to start", "starting point", "begin", "start from"], ctx: ["route-builder", "home"], intent: "choose_start", next: ["how-many-days", "route-builder", "plan"], res: { type: "tool", pageKey: "routeBuilder", label: "Set My Start Point" }, pri: 6 });
  F("how-many-days", "How many days do you recommend?",
    "Plan 2 to 3 days for one hill station, 4 to 6 for two districts, and 7 or more for a circuit such as Shimla, Kinnaur, Spiti and Manali. Add rest days at altitude.",
    { kw: ["how many days", "how long", "duration", "days needed", "number of days"], ctx: ["route-builder", "home", "packages", "encyclopedia"], intent: "trip_length", next: ["plan", "cost-calc", "best-time"], res: { type: "recommend" }, pri: 8 });

  // Type 4: recommendations
  F("packages-how", "Which package suits me?",
    "Browse the packages, open one to see the day-by-day plan, and send an enquiry. Or answer three quick questions and I will suggest a direction.",
    { kw: ["package", "packages", "tour", "which package", "recommend"], ctx: ["home", "packages", "blog"], intent: "find_package", next: ["cost-calc", "inclusions", "customize"], res: { type: "recommend" }, rel: [{ pageKey: "packages", label: "Explore Tour Packages" }], pri: 9, live: true });
  F("which-district", "Which district should I pick?", "I can narrow it down from your days, interests and season.", { ctx: ["encyclopedia"], intent: "pick_district", res: { type: "recommend" }, pri: 8, kw: ["which district", "where should i go", "which place"] });

  // Type 2: navigation
  F("encyclopedia-how", "How can I explore destinations by district?",
    "Our encyclopedia groups places by district, with sights, seasons and travel notes for each of the 12 districts.",
    { kw: ["encyclopedia", "explore destinations", "by district", "district guide", "places to visit", "which places"], ctx: ["home", "encyclopedia", "blog"], intent: "discover_destinations", next: ["hidden-gems", "best-time", "plan"], res: { type: "page", pageKey: "encyclopedia", label: "Explore Encyclopedia" }, pri: 8 });
  F("hidden-gems", "Can I find hidden gems?",
    "Yes. Lesser-known spots include Lama Dal and Chhadasaru lakes in Chamba, Barot in Mandi, and Nako in Kinnaur. The district guides list more.",
    { kw: ["hidden gem", "offbeat", "off beat", "less crowded", "no crowd", "quiet", "lesser known", "unexplored"], ctx: ["encyclopedia", "home", "blog"], intent: "find_offbeat", next: ["best-time", "plan"], res: { type: "page", pageKey: "encyclopedia", label: "Explore Encyclopedia" }, rel: [{ pageKey: "district:chamba" }, { pageKey: "district:kinnaur" }], pri: 7 });
  F("bir-billing", "Tell me about Bir Billing",
    "Bir Billing is a popular destination in Kangra district, known for paragliding, mountain views, Tibetan cultural influence and nearby attractions. Flying depends on weather and season.",
    { kw: ["bir", "billing", "paragliding", "paraglide"], ctx: ["encyclopedia", "home"], intent: "destination_info", next: ["best-time", "adventure", "route-builder"], res: { type: "page", pageKey: "district:kangra", label: "Explore Bir Billing Guide" }, rel: [{ pageKey: "routeBuilder", label: "Plan a Bir Billing Trip" }, { pageKey: "packages", label: "Explore Activities" }], pri: 6 });
  F("contact", "How do I contact you?", "WhatsApp is fastest. Use the button below and we will carry your details over.",
    { kw: ["contact", "phone", "call you", "email", "number", "reach you"], ctx: ["contact", "home", "about"], intent: "contact", res: { type: "page", pageKey: "contact", label: "Contact Travel Expert" }, next: ["whatsapp"], pri: 6 });
  F("who", "Who are you?", CFG.brand + " is a Himachal Pradesh travel platform for packages, stays and trip planning across all 12 districts.",
    { kw: ["who are you", "about you", "company", "about us", "himachal explorer"], ctx: ["about", "home"], intent: "about", res: { type: "page", pageKey: "about", label: "About Us" }, next: ["packages-how", "whatsapp"], pri: 5 });
  F("how-book", "How do I book?", "Choose a package, fill in the booking form with dates and group size, and our team will confirm details with you. You can also start on WhatsApp.",
    { kw: ["book", "booking", "reserve", "how to book", "confirm"], ctx: ["packages", "package-detail", "booking", "home"], intent: "book", res: { type: "page", pageKey: "booking", label: "Go to Booking" }, next: ["payment", "cancel", "whatsapp"], pri: 8 });

  // Type 1: informational
  F("best-time", "What is the best time to visit Himachal?",
    "It depends on what you want. <b>Mar to Jun</b> suits hill stations and sightseeing. <b>Jun to Oct</b> is the window for Spiti, Lahaul and high Kinnaur. <b>Dec to Feb</b> is for snow in Shimla and Manali. Monsoon (Jul to Sep) raises landslide risk on many roads.",
    { kw: ["best time", "when to visit", "when to go", "season", "weather"], ctx: ["home", "encyclopedia", "blog", "packages"], intent: "best_season", next: ["snow", "spiti-winter", "monsoon"], pri: 9 });
  F("snow", "Where can I see snow?", "Snow is most reliable from <b>Dec to Feb</b> around Manali, Solang, Shimla, Kufri and Narkanda. Higher areas like Kinnaur see it earlier. Snowfall can't be guaranteed for any given date.",
    { kw: ["snow", "snowfall", "skiing"], intent: "snow", next: ["best-time", "plan"], res: { type: "page", pageKey: "district:kullu", label: "Kullu Guide" }, rel: [{ pageKey: "district:shimla" }], pri: 6 });
  F("spiti-winter", "Is Spiti open in winter?", "The Manali side of Spiti is usually shut by snow in winter and access is limited. The best window is roughly <b>Jun to Oct</b>. For winter we can plan a different circuit.",
    { kw: ["spiti winter", "spiti open", "kunzum", "winter spiti"], intent: "spiti_access", next: ["altitude", "best-time", "plan"], res: { type: "page", pageKey: "district:spiti", label: "Spiti Guide" }, pri: 5 });
  F("monsoon", "Is monsoon a bad time to travel?", "It is the riskiest season for roads, especially in Kinnaur, Kullu and the Shimla highways. Spiti and Lahaul are drier. We can choose safer routes and keep your plan flexible.",
    { kw: ["monsoon", "rain", "rainy", "landslide"], intent: "monsoon", next: ["best-time", "plan", "whatsapp"], pri: 5 });
  F("altitude", "Altitude sickness in Spiti or Kinnaur", "Spiti and high Kinnaur go well above 3,000 m. Ascend gradually, rest on day one, drink water and avoid alcohol. Check with your doctor if you have health concerns. Our itineraries include acclimatisation stops.",
    { kw: ["altitude", "sickness", "ams", "oxygen", "breathless"], intent: "altitude", next: ["spiti-winter", "plan"], pri: 4 });
  F("permit", "Do I need permits?", "Some routes (such as Rohtang Pass) need a vehicle permit, and rules for border areas change from time to time. Tell us your route and we will confirm what applies before you travel.",
    { kw: ["permit", "inner line", "rohtang", "permission"], intent: "permits", next: ["documents", "whatsapp"], res: { type: "human" }, pri: 5 });
  F("documents", "What ID should I carry?", "Carry a government photo ID for every traveller. Hotels require it at check-in. Foreign nationals should carry their passport and visa.",
    { kw: ["document", "passport", "aadhaar", "identity", "id proof"], intent: "documents", next: ["permit", "how-book"], pri: 3 });
  F("inclusions", "What is included in a package?", "Each package page lists its own inclusions and exclusions: stay, transfers, meals and sightseeing. Check the package you are viewing, and ask us if anything is unclear.",
    { kw: ["include", "included", "inclusion", "exclusion", "meals", "what do i get"], ctx: ["packages", "package-detail"], intent: "inclusions", live: true, next: ["customize", "cost-calc"], res: { type: "page", pageKey: "packages", label: "View Tour Packages" }, pri: 8 });
  F("customize", "Can you customize a trip?", "Yes. Tell us your dates, group size, interests and budget, and we will adjust a package or build one from scratch.",
    { kw: ["customize", "customise", "custom", "modify", "own trip", "personal"], ctx: ["packages", "package-detail", "home"], intent: "customize", next: ["route-builder", "whatsapp"], res: { type: "human" }, pri: 7 });
  F("payment", "How do I pay?", CFG.payment, { kw: ["pay", "payment", "advance", "deposit", "upi", "card"], ctx: ["booking"], intent: "payment", next: ["cancel", "how-book"], res: { type: "human" }, pri: 7 });
  F("cancel", "What is the cancellation policy?", CFG.cancel, { kw: ["cancel", "cancellation", "refund", "reschedule"], ctx: ["booking"], intent: "cancellation", next: ["payment", "whatsapp"], res: { type: "human" }, pri: 7 });
  F("group", "Do you do group or family trips?", CFG.group, { kw: ["group", "corporate", "friends", "kids", "children", "senior"], intent: "group_trip", next: ["plan", "whatsapp"], res: { type: "human" }, pri: 5 });
  F("stay", "What kind of stays do you offer?", "We work with hotels, homestays and partner properties across Himachal. Plum Valley Cottage is one of our official partner stays. Tell us your dates and we will check availability.",
    { kw: ["hotel", "stay", "homestay", "cottage", "resort", "accommodation", "plum valley"], intent: "stay", next: ["customize", "whatsapp"], res: { type: "page", pageKey: "hotels", label: "Browse Hotels & Stays" }, pri: 5 });
  F("transport", "How do I reach Himachal?", "Most travellers come via Chandigarh or Delhi, then continue by road. Nearest airports include Chandigarh, Bhuntar (Kullu), Kangra (Gaggal) and Shimla. Ask us about pickups and taxis from your arrival point.",
    { kw: ["reach", "train", "flight", "airport", "bus", "how to get", "pickup", "taxi"], intent: "transport", next: ["start-where", "whatsapp"], res: { type: "page", pageKey: "taxi", label: "Taxi Service" }, pri: 4 });
  F("safety", "Is it safe for solo or women travellers?", "Himachal is popular with solo and women travellers. Use normal precautions, avoid night driving on mountain roads and share your itinerary with someone. We can suggest well-reviewed stays and drivers.",
    { kw: ["safe", "safety", "solo", "women", "female", "alone"], intent: "safety", next: ["whatsapp", "plan"], pri: 4 });
  F("adventure", "What adventure activities are there?", "Popular options include paragliding at Bir Billing, treks around Kullu and Kinnaur, and camping in Spiti. Availability depends on season and weather.",
    { kw: ["adventure", "trek", "trekking", "rafting", "camping", "solang"], intent: "adventure", next: ["best-time", "plan"], res: { type: "page", pageKey: "district:kullu", label: "Kullu Guide" }, rel: [{ pageKey: "treks" }, { pageKey: "district:kangra" }], pri: 5 });
  F("spiritual", "Temples and monasteries", "Kangra has Baijnath and Kangra Fort, Mandi has Rewalsar Lake, Chamba has its old stone temples, Una has Chintpurni, and Spiti has Key Monastery and Tabo.",
    { kw: ["temple", "monastery", "spiritual", "pilgrimage", "buddhist", "devi", "gompa"], intent: "spiritual", next: ["plan", "which-district"], res: { type: "page", pageKey: "encyclopedia", label: "Explore Encyclopedia" }, pri: 4 });

  // Pages confirmed by the sitemap. Answers are deliberately light: they send people to the page instead of guessing its contents.
  F("hotels", "Where can I find hotels and stays?", "Our hotels page lists the stays we work with. Tell us your dates and area and we will check availability.",
    { kw: ["hotels", "book a hotel", "where to stay"], ctx: ["hotels", "home", "packages"], intent: "find_hotel", next: ["customize", "cost-calc"], res: { type: "page", pageKey: "hotels", label: "Browse Hotels & Stays" }, pri: 8, live: true });
  F("bike", "Can I rent a bike?", "Bike rentals are on our bike rental page. Check it for what is offered, and ask our team about routes and season before you ride in the mountains.",
    { kw: ["bike", "bike rental", "motorcycle", "royal enfield", "scooter", "ride"], ctx: ["bike", "home"], intent: "bike_rental", next: ["best-time", "permit", "whatsapp"], res: { type: "page", pageKey: "bikeRental", label: "Bike Rental" }, pri: 8, live: true });
  F("taxi", "Do you offer taxi service?", "Taxi service details are on our taxi page. Send us your route and dates for a quote.",
    { kw: ["taxi", "cab", "driver", "car rental", "innova", "tempo traveller"], ctx: ["taxi", "home", "packages"], intent: "taxi", next: ["transport", "cost-calc", "whatsapp"], res: { type: "page", pageKey: "taxi", label: "Taxi Service" }, pri: 8, live: true });
  F("treks", "Which treks do you offer?", "Our treks page lists trekking options in Himachal. Season and fitness matter a lot, so tell us your dates and experience.",
    { kw: ["trek", "treks", "trekking", "hike", "hiking"], ctx: ["treks", "home", "blog"], intent: "trekking", next: ["altitude", "best-time", "whatsapp"], res: { type: "page", pageKey: "treks", label: "Explore Treks" }, pri: 8 });
  F("agent", "I am a travel agent. Can we partner?", "Yes, we have a page for agents and partners with the details of how to work with us.",
    { kw: ["agent", "partner", "b2b", "commission", "collaborate", "tie up", "reseller"], ctx: ["agent", "about"], intent: "partnership", next: ["contact", "whatsapp"], res: { type: "page", pageKey: "agent", label: "Agent & Partner Page" }, pri: 8 });
  F("build-trip", "I want to build my own trip", "You can shape a trip step by step on our trip-building pages, or start with the route builder.",
    { kw: ["build my trip", "build your trip", "plan your trip", "trip planner", "design my trip"], ctx: ["home", "packages", "route-builder"], intent: "build_trip", next: ["route-builder", "plan", "cost-calc"], res: { type: "page", pageKey: "buildYourTrip", label: "Build Your Trip" }, rel: [{ pageKey: "routeBuilder" }, { pageKey: "planYourTrip" }], pri: 9 });

  var GENERIC_FALLBACK_CHIPS = ["plan", "best-time", "cost-calc", "whatsapp"];

  /* ===== Package catalogue: slugs from your sitemap (/pkg/*.html). Prices are deliberately NOT here: they are live on the site.
   * If you add packages, add the slug here (or ask us to regenerate this list from the new sitemap). ===== */
  var PACKAGE_SLUGS = ["chamba-pangi-5d", "chamba-sach-6d", "chandigarh-best-value-5d", "chandigarh-grand-himachal-16d", "chandigarh-jibhi-seraj-4d",
    "chandigarh-kasauli-barog-2d", "chandigarh-manali-dharamshala-chamba-10d", "chandigarh-manali-spiti-shimla-14d", "chandigarh-prashar-mandi-3d",
    "delhi-himachal-best-value-7d", "delhi-himachal-complete-10d", "delhi-kinnaur-spiti-10d", "delhi-renuka-tattapani-3d", "kinnaur-complete-6d",
    "lower-hp-offbeat-3d", "shimla-apple-belt-4d", "shimla-hidden-3d", "shimla-rohru-chandan-nahan-6d", "shimla-rohru-deep-adventure-7d"];
  var SLUG_TO_DISTRICT = { manali: "kullu", jibhi: "kullu", dharamshala: "kangra", kasauli: "solan", barog: "solan", prashar: "mandi", renuka: "sirmour", nahan: "sirmour", pangi: "chamba", sach: "chamba", rohru: "shimla" };
  function slugInfo(slug) {
    var t = slug.split("-"), m = slug.match(/-(\d+)d$/), days = m ? parseInt(m[1], 10) : 0, ds = {};
    t.forEach(function (w) { if (DISTRICTS[w]) ds[w] = 1; if (SLUG_TO_DISTRICT[w]) ds[SLUG_TO_DISTRICT[w]] = 1; });
    var label = t.filter(function (w) { return !/^\d+d$/.test(w); }).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ") + " (" + days + " days)";
    return { slug: slug, days: days, districts: Object.keys(ds), start: t[0], label: label, adventure: /adventure|deep|spiti|kinnaur/.test(slug), offbeat: /hidden|offbeat/.test(slug) };
  }
  var PACKAGES = PACKAGE_SLUGS.map(slugInfo);
  /* Type 4 (dynamic recommendation): filter the real package list by start city, length, districts, interest, season */
  function suggestPackages(districtIds) {
    var P = session.plan, start = (P.startPoint || "").toLowerCase();
    return PACKAGES.map(function (k) {
      var sc = 0;
      k.districts.forEach(function (d) { if (districtIds.indexOf(d) > -1) sc += 3; });
      if (start && k.start === start) sc += 2;
      if (P.duration) sc -= Math.abs(k.days - P.duration) * 0.5;
      if (P.interest === "adventure" && k.adventure) sc += 2;
      if ((P.interest === "relax" || P.interest === "family" || P.interest === "honeymoon") && k.offbeat) sc += 1;
      if (P.season === "winter" && /spiti|kinnaur/.test(k.slug)) sc -= 6;
      return { k: k, sc: sc };
    }).filter(function (x) { return x.sc > 0; }).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 2)
      .map(function (x) { return { label: x.k.label, href: "/pkg/" + x.k.slug + ".html" }; });
  }

  /* ================= 4. JOURNEY MEMORY ================= */
  var session = { lead: null, plan: {}, lastQ: "", await: null };
  try { var sv = sessionStorage.getItem("hx_session"); if (sv) session = Object.assign(session, JSON.parse(sv)); } catch (e) {}
  function persist() { try { sessionStorage.setItem("hx_session", JSON.stringify(session)); } catch (e) {} }
  function leadId() {
    if (!session.lead) {
      var d = new Date(), p = function (n) { return ("0" + n).slice(-2); };
      session.lead = "HX-" + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
      persist();
    }
    return session.lead;
  }
  var CITIES = ["chandigarh", "delhi", "shimla", "manali", "pathankot", "dehradun", "amritsar", "jaipur", "mumbai", "bangalore", "kolkata", "ludhiana", "kalka", "ambala"];
  var INTEREST_WORDS = [
    ["adventure", ["adventure", "trek", "paraglid", "rafting", "thrill"]],
    ["snow", ["snow", "mountain", "skiing", "cold"]],
    ["relax", ["peace", "relax", "calm", "quiet", "no crowd", "chill"]],
    ["family", ["family", "kids", "children", "parents"]],
    ["honeymoon", ["honeymoon", "romantic", "couple"]],
    ["spiritual", ["temple", "spiritual", "pilgrim", "monastery"]]
  ];
  /* Pull journey facts out of free text so the bot doesn't re-ask what was already said */
  function learn(text) {
    var t = text.toLowerCase(), P = session.plan, found = {};
    var m = t.match(/\b(\d{1,2})\s*(?:-\s*\d{1,2}\s*)?(?:day|days|night|nights)\b/);
    if (m) { P.duration = parseInt(m[1], 10); found.duration = 1; }
    CITIES.forEach(function (c) { if (new RegExp("\\b(from|start|starting|leaving|in)\\s+" + c).test(t) || (session.await === "start" && t.indexOf(c) > -1)) { P.startPoint = c.charAt(0).toUpperCase() + c.slice(1); found.start = 1; } });
    INTEREST_WORDS.forEach(function (iw) { iw[1].forEach(function (w) { if (t.indexOf(w) > -1) { P.interest = iw[0]; found.interest = 1; } }); });
    if (/\bwinter\b|december|january|february/.test(t)) { P.season = "winter"; found.season = 1; }
    else if (/\bsummer\b|in may\b|\bjune\b|april/.test(t)) { P.season = "summer"; found.season = 1; }
    else if (/monsoon|july|august/.test(t)) { P.season = "monsoon"; found.season = 1; }
    else if (/autumn|october|november|september/.test(t)) { P.season = "autumn"; found.season = 1; }
    var n = Object.keys(found).length;
    if (n) persist();
    return n; // how many trip facts this message gave us
  }

  /* ================= 5. HELPERS ================= */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function planSummary() {
    var P = session.plan, a = [];
    if (P.duration) a.push("Days: " + P.duration);
    if (P.interest) a.push("Interest: " + P.interest);
    if (P.startPoint) a.push("Start: " + P.startPoint);
    if (P.season) a.push("Season: " + P.season);
    if (P.intent) a.push("Intent: " + P.intent);
    return a;
  }
  function waLink(extra) {
    if (/X/i.test(CFG.whatsapp)) { console.warn("[hx-chatbot] WhatsApp number not set (HX_CONFIG.whatsapp). Falling back to the contact page."); var c = PAGE_REGISTRY.contact; return c ? c.url : "/contact.html"; }
    var parts = ["Hi " + CFG.brand + "! Lead ID: " + leadId(), "Page: " + location.pathname].concat(planSummary());
    if (session.lastQ) parts.push("My question: " + session.lastQ);
    if (extra) parts.push(extra);
    return "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(parts.join("\n"));
  }
  var page = (function () {
    var path = location.pathname.replace(/\/+$/, "") || "/";
    for (var i = 0; i < PAGE_PATTERNS.length; i++) {
      var m = path.match(PAGE_PATTERNS[i].re);
      if (m) return { type: PAGE_PATTERNS[i].type, district: PAGE_PATTERNS[i].type === "district" ? m[1] : null };
    }
    return { type: "fallback", district: null };
  })();

  /* ================= 6. UI ================= */
  var css = ""
    + ":root{--hx-bottom:" + (parseInt(HX.offsetBottom, 10) || 16) + "px}"
    + "#hx-btn{position:fixed!important;top:auto!important;left:auto!important;margin:0!important;right:max(16px,env(safe-area-inset-right))!important;bottom:calc(var(--hx-bottom) + env(safe-area-inset-bottom))!important;z-index:2147483000!important;background:#f28c28;color:#fff;border:0;border-radius:28px;padding:12px 18px;font:600 15px/1 inherit;font-family:inherit;box-shadow:0 4px 14px rgba(18,40,90,.3);cursor:pointer}"
    + "#hx-btn:focus-visible,#hx-panel button:focus-visible,#hx-panel input:focus-visible,#hx-panel a:focus-visible{outline:3px solid #1f6feb;outline-offset:2px}"
    + "#hx-panel{position:fixed!important;top:auto!important;left:auto!important;margin:0!important;right:max(12px,env(safe-area-inset-right))!important;bottom:calc(var(--hx-bottom) + env(safe-area-inset-bottom))!important;z-index:2147483001!important;width:min(380px,calc(100vw - 24px));height:min(600px,calc(100vh - 64px));background:#f6f8fb;border-radius:14px;box-shadow:0 10px 40px rgba(18,40,90,.35);display:none;flex-direction:column;overflow:hidden;font-family:inherit;color:#1b2333}"
    + "#hx-panel.open{display:flex}"
    + "#hx-head{background:#12285a;color:#fff;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px}"
    + "#hx-head b{font-size:15px}#hx-head small{display:block;opacity:.75;font-size:12px;margin-top:2px}"
    + "#hx-head button{background:transparent;border:0;color:#fff;font-size:22px;cursor:pointer;padding:4px 8px}"
    + "#hx-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}"
    + ".hx-m{max-width:88%;padding:9px 12px;border-radius:12px;font-size:14px;line-height:1.45;word-wrap:break-word}"
    + ".hx-bot{background:#fff;border:1px solid #dfe5ef;align-self:flex-start}"
    + ".hx-me{background:#1f6feb;color:#fff;align-self:flex-end}"
    + ".hx-m a{color:#1f6feb;font-weight:600}"
    + ".hx-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}"
    + ".hx-links a{background:#eaf1fe;border-radius:14px;padding:5px 10px;text-decoration:none;font-size:13px}"
    + ".hx-links a.hx-main{background:#1f6feb;color:#fff}"
    + ".hx-links a.hx-wa{background:#f28c28;color:#fff}"
    + ".hx-m.hx-wide{max-width:100%;width:100%;box-sizing:border-box}"
    + ".hx-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px}"
    + ".hx-m a.hx-tile{display:flex;flex-direction:column;gap:5px;background:#fff;border:1px solid #cfd8e8;border-radius:10px;padding:10px;text-decoration:none;color:#12285a;font-weight:400;min-height:78px}"
    + ".hx-m a.hx-tile:hover{border-color:#1f6feb;box-shadow:0 2px 8px rgba(31,111,235,.18)}"
    + ".hx-tile b{font-size:13px;line-height:1.25;font-weight:700}"
    + ".hx-tile small{font-size:12px;color:#5a6780;line-height:1.3}"
    + ".hx-badge{align-self:flex-start;background:#f28c28;color:#fff;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:600}"
    + "#hx-chips{padding:0 12px 8px;display:flex;flex-wrap:wrap;gap:6px}"
    + "#hx-chips button{background:#fff;border:1px solid #1f6feb;color:#1f6feb;border-radius:16px;padding:6px 11px;font-size:13px;cursor:pointer;font-family:inherit}"
    + "#hx-chips button.hx-cta{background:#f28c28;border-color:#f28c28;color:#fff;font-weight:600}"
    + "#hx-form{display:flex;gap:6px;padding:10px 12px;border-top:1px solid #dfe5ef;background:#fff}"
    + "#hx-in{flex:1;border:1px solid #c8d1e0;border-radius:8px;padding:9px 10px;font-size:14px;font-family:inherit}"
    + "#hx-send{background:#1f6feb;color:#fff;border:0;border-radius:8px;padding:0 14px;font-weight:600;cursor:pointer;font-family:inherit}"
    + "@media (prefers-reduced-motion:no-preference){#hx-panel.open{animation:hxin .18s ease-out}@keyframes hxin{from{transform:translateY(10px);opacity:0}to{transform:none;opacity:1}}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var btn = document.createElement("button");
  btn.id = "hx-btn"; btn.type = "button"; btn.textContent = "Plan your trip"; btn.setAttribute("aria-label", "Open trip assistant");
  var panel = document.createElement("div");
  panel.id = "hx-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", CFG.brand + " assistant");
  panel.innerHTML = '<div id="hx-head"><div><b>' + esc(CFG.brand) + '</b><small>Trip assistant</small></div><button type="button" id="hx-x" aria-label="Close">&times;</button></div>'
    + '<div id="hx-log" aria-live="polite"></div><div id="hx-chips"></div>'
    + '<form id="hx-form"><input id="hx-in" type="text" placeholder="Ask about a trip, place or price" autocomplete="off" aria-label="Your question"><button id="hx-send" type="submit">Send</button></form>';
  document.body.appendChild(btn); document.body.appendChild(panel);
  var log = panel.querySelector("#hx-log"), chips = panel.querySelector("#hx-chips"), input = panel.querySelector("#hx-in");

  function say(html, who, links, tiles) {
    var el = document.createElement("div");
    el.className = "hx-m " + (who === "me" ? "hx-me" : "hx-bot");
    if (who === "me") el.textContent = html; else el.innerHTML = html;
    var ls = (links || []).filter(Boolean);
    if (ls.length) {
      var w = document.createElement("div"); w.className = "hx-links";
      ls.forEach(function (l, i) { var a = document.createElement("a"); a.href = l.href; a.textContent = l.label; if (l.kind) a.className = l.kind; else if (i === 0) a.className = "hx-main"; w.appendChild(a); });
      el.appendChild(w);
    }
    if (tiles && tiles.length) {
      var g = document.createElement("div"); g.className = "hx-grid";
      tiles.forEach(function (t) {
        var a = document.createElement("a"); a.className = "hx-tile"; a.href = t.href; a.setAttribute("aria-label", t.title + ", " + t.badge);
        var bd = document.createElement("span"); bd.className = "hx-badge"; bd.textContent = t.badge; a.appendChild(bd);
        var b = document.createElement("b"); b.textContent = t.title; a.appendChild(b);
        if (t.sub) { var sm = document.createElement("small"); sm.textContent = t.sub; a.appendChild(sm); }
        g.appendChild(a);
      });
      el.className += " hx-wide"; el.appendChild(g);
    }
    log.appendChild(el); log.scrollTop = log.scrollHeight;
    return el;
  }
  function setChips(list) {
    chips.innerHTML = "";
    list.slice(0, 4).forEach(function (c) {
      var b = document.createElement("button"); b.type = "button";
      if (typeof c === "string") {
        var f = byId(c); if (!f || !f.on) return;
        b.textContent = f.q; if (c === "whatsapp") b.className = "hx-cta";
        b.onclick = function () { say(f.q, "me"); session.lastQ = f.q; persist(); answer(c); };
      } else { b.textContent = c.label; if (c.cta) b.className = "hx-cta"; b.onclick = function () { say(c.label, "me"); c.fn(); }; }
      chips.appendChild(b);
    });
  }
  function pageChips() {
    var ids = FAQ.filter(function (f) { return f.on && f.ctx.indexOf(page.type) > -1 && f.id !== "whatsapp"; })
      .sort(function (a, b) { return b.pri - a.pri; }).slice(0, 3).map(function (f) { return f.id; });
    return ids.length ? ids.concat(["whatsapp"]) : GENERIC_FALLBACK_CHIPS;
  }

  /* ================= 7. RESOLUTION ENGINE ================= */
  function handoff(extra) {
    say("I'll pass this to our team with your Lead ID <b>" + leadId() + "</b>, along with what you've told me, so you don't have to repeat yourself.", "bot", [{ label: "Open WhatsApp", href: waLink(extra), kind: "hx-wa" }]);
    setChips(["plan", "best-time", "cost-calc"]);
  }
  function suggestNext(f) {
    var ids = (f.next || []).filter(function (id) { var x = byId(id); return x && x.on; });
    if (ids.indexOf("whatsapp") < 0) ids.push("whatsapp");
    setChips(ids.slice(0, 4));
  }

  function answer(id) {
    var f = byId(id); if (!f || !f.on) return;
    if (!f.res || f.res.type !== "action") { session.plan.intent = f.intent; persist(); } // actions (plan, whatsapp) never overwrite the real intent

    if (id === "plan") return planner();
    if (id === "whatsapp") return handoff();
    if (id === "d-best" || id === "d-see") {
      var d = DISTRICTS[page.district];
      if (!d) { say("Open a district page first, or tell me which district you mean.", "bot"); return setChips(["plan", "which-district"]); }
      say(id === "d-best" ? "Best time for <b>" + d.name + "</b>: " + d.best + "." : "Worth seeing in <b>" + d.name + "</b>: " + d.pts + ".", "bot", [link("packages")]);
      return setChips(["d-see", "d-best", "plan", "whatsapp"].filter(function (x) { return x !== id; }));
    }

    var r = f.res || { type: "answer" };
    var links = [];
    if (r.type === "recommend") {
      if (f.a) say(f.a, "bot", [link("packages")]);
      return planner();
    }
    if (r.pageKey) links.push(link(r.pageKey, r.label));
    f.rel.forEach(function (x) { links.push(link(x.pageKey, x.label)); });
    if (r.type === "human") links.push({ label: "Ask on WhatsApp", href: waLink("Topic: " + f.q), kind: "hx-wa" });
    var body = f.a;
    if (f.live) body += "<br><small>Live prices and availability are on the site.</small>";
    say(body, "bot", links);
    suggestNext(f);
  }

  function match(text) {
    var t = text.toLowerCase(), best = null, score = 0;
    Object.keys(DISTRICTS).forEach(function (k) { if (t.indexOf(k) > -1) { best = { district: k }; score = 99; } });
    if (score === 99) return best;
    FAQ.forEach(function (f) {
      if (!f.on) return;
      var s = 0;
      f.kw.forEach(function (w) { if (t.indexOf(w) > -1) s += w.length > 4 ? 2 : 1; });
      if (s && f.ctx.indexOf(page.type) > -1) s += 1;   // page context boost
      if (s) s += f.pri / 100;                          // priority tie-break
      if (s > score) { score = s; best = { id: f.id }; }
    });
    return score >= 1 ? best : null;
  }

  function onText(text) {
    say(text, "me");
    session.lastQ = text;
    if (page.type === "packages") {
      var low = text.toLowerCase();
      for (var ci = 0; ci < START_CITIES.length; ci++) if (low.indexOf(START_CITIES[ci]) > -1) { session.lastQ = text; return showPackages(START_CITIES[ci]); }
    }
    var learned = learn(text);
    if (session.await === "start") { session.await = null; persist(); return planner(); }
    persist();
    if (learned >= 2 && page.type !== "packages") return planner(); // e.g. "adventure, 7 days from Delhi in June": enough to plan, skip FAQ matching
    var m = match(text);
    if (m && m.district) {
      var d = DISTRICTS[m.district];
      say("<b>" + d.name + "</b>: " + d.pts + ". Best time: " + d.best + ".", "bot", [link("district:" + m.district), link("packages"), link("routeBuilder", "Plan a " + d.name + " Trip")]);
      return setChips(["plan", "best-time", "cost-calc", "whatsapp"]);
    }
    if (m && m.id) return answer(m.id);
    if (learned) return planner(); // e.g. "I want mountains and no crowd, 7 days from Delhi"
    if (CFG.aiFallback) {
      var el = say("Thinking...", "bot");
      CFG.aiFallback(text, session).then(function (r) { el.innerHTML = r; setChips(["plan", "whatsapp"]); })
        .catch(function () { el.textContent = "I couldn't work that out. Our team can help."; setChips(["whatsapp", "plan"]); });
      return;
    }
    say("I'm not sure I understood that. Try one of these, or send it to our team.", "bot");
    setChips(GENERIC_FALLBACK_CHIPS);
  }

  /* ================= 7b. PACKAGES PAGE: ask only "where do you start?", answer with a tile grid ================= */
  var START_CITIES = ["chandigarh", "delhi", "shimla"];
  function cap(w) { return w === "hp" ? "HP" : w.charAt(0).toUpperCase() + w.slice(1); }
  function startKey(k) { return START_CITIES.indexOf(k.start) > -1 ? k.start : "other"; }
  function tileFor(k) {
    var words = k.slug.split("-").filter(function (w) { return !/^\d+d$/.test(w); });
    if (START_CITIES.indexOf(k.start) > -1) words.shift(); // "delhi-himachal-best-value-7d" -> "Himachal Best Value"
    var ds = k.districts.map(function (d) { return DISTRICTS[d] ? DISTRICTS[d].name : null; }).filter(Boolean).join(" \u00b7 ");
    return { title: words.map(cap).join(" "), badge: k.days + " days", sub: ds, href: "/pkg/" + k.slug + ".html" };
  }
  function packagesFor(key) { return PACKAGES.filter(function (k) { return startKey(k) === key; }).sort(function (a, b) { return a.days - b.days; }); }
  function showPackages(key) {
    var list = packagesFor(key);
    if (key !== "other") { session.plan.startPoint = cap(key); session.plan.intent = "browse_packages"; persist(); }
    var where = key === "other" ? "Packages based in other regions of Himachal" : "Packages starting from <b>" + cap(key) + "</b>";
    say(where + " (" + list.length + "). Tap a tile to open it.", "bot", null, list.map(tileFor));
    setChips([{ label: "Change start point", fn: function () { packageStart(false); } }, "whatsapp"]);
  }
  function packageStart(silent) {
    if (!silent) say("Where will you start your trip?", "bot");
    var opts = START_CITIES.filter(function (c) { return packagesFor(c).length; }).map(function (c) { return { label: cap(c) + " (" + packagesFor(c).length + ")", fn: function () { showPackages(c); } }; });
    if (packagesFor("other").length) opts.push({ label: "Other regions (" + packagesFor("other").length + ")", fn: function () { showPackages("other"); } });
    setChips(opts);
  }

  /* ================= 8. JOURNEY PLANNER (skips anything already known) ================= */
  var INTEREST_OPTS = [["Snow and mountains", "snow"], ["Adventure", "adventure"], ["Peaceful vacation", "relax"], ["Family holiday", "family"], ["Honeymoon", "honeymoon"], ["Temples and culture", "spiritual"], ["Explore everything", "all"]];
  function opt(label, key, val) { return { label: label, fn: function () { session.plan[key] = val; persist(); planner(); } }; }

  function planner() {
    var P = session.plan;
    if (!P.interest) {
      say("What kind of experience interests you?", "bot");
      var o = INTEREST_OPTS.slice(0, 4).map(function (x) { return opt(x[0], "interest", x[1]); });
      o[3] = { label: "More options", fn: function () { say("Pick one:", "bot"); setChips(INTEREST_OPTS.slice(3).map(function (x) { return opt(x[0], "interest", x[1]); })); } };
      return setChips(o);
    }
    if (!P.duration) {
      say("How many days do you have?", "bot");
      return setChips([opt("2 to 3 days", "duration", 3), opt("4 to 6 days", "duration", 5), opt("7 days", "duration", 7), opt("10+ days", "duration", 10)]);
    }
    if (!P.startPoint) {
      say("Where will you start?", "bot");
      return setChips([opt("Chandigarh", "startPoint", "Chandigarh"), opt("Delhi", "startPoint", "Delhi"), opt("Shimla", "startPoint", "Shimla"),
        { label: "Somewhere else", fn: function () { session.await = "start"; persist(); say("Type your starting city.", "bot"); chips.innerHTML = ""; input.focus(); } }]);
    }
    if (!P.season) {
      say("When are you travelling?", "bot");
      return setChips([opt("Mar to Jun", "season", "summer"), opt("Jul to Sep", "season", "monsoon"), opt("Oct to Nov", "season", "autumn"), opt("Dec to Feb", "season", "winter")]);
    }
    recommend();
  }

  function recommend() {
    var P = session.plan, note = "";
    P.intent = "build_itinerary"; persist();
    var wanted = { family: ["relax"], honeymoon: ["snow", "relax"], all: ["adventure", "snow", "relax", "spiritual"] }[P.interest] || [P.interest];
    var ids = Object.keys(DISTRICTS).filter(function (k) { return DISTRICTS[k].tags.some(function (t) { return wanted.indexOf(t) > -1; }); });
    var POP = { kullu: 10, shimla: 9, kangra: 8, spiti: 8, kinnaur: 7, chamba: 6, mandi: 5, solan: 4, sirmour: 3, bilaspur: 2, una: 2, hamirpur: 1 }; // most-visited first
    ids.sort(function (a, b) { return (POP[b] || 0) - (POP[a] || 0); });
    if (P.season === "winter") { ids = ids.filter(function (k) { return k !== "spiti"; }); note += "Spiti is left out because its roads are usually closed by snow in winter. "; }
    if (P.season === "monsoon") { note += "Monsoon roads can be disrupted, so we'd keep the plan flexible. Spiti is drier than most areas. "; ids.sort(function (a, b) { return (b === "spiti") - (a === "spiti"); }); }
    if (P.interest === "snow" && (P.season === "summer" || P.season === "monsoon")) note += "Snow isn't reliable in this season except at high passes; Dec to Feb is the sure window. ";
    if (P.interest === "snow" && P.season === "winter") ids.sort(function (a, b) { var f = function (x) { return x === "shimla" || x === "kullu"; }; return f(b) - f(a); });
    var n = P.duration <= 3 ? 1 : P.duration <= 6 ? 2 : 3;
    if (n === 1) note += "With " + P.duration + " days, one district is realistic. ";
    if (P.duration >= 7 && ids.indexOf("spiti") > -1 && P.season !== "winter") note += "A week or more allows a circuit through Kinnaur and Spiti. ";
    ids = ids.slice(0, n);
    if (!ids.length) { say("I couldn't match that combination. Our team can build something for you.", "bot"); return setChips(["whatsapp", "plan"]); }

    var lines = ids.map(function (k) { return "<b>" + DISTRICTS[k].name + "</b>: " + DISTRICTS[k].pts; }).join("<br>");
    var head = "For " + P.duration + " days from " + esc(P.startPoint) + " (" + esc(P.interest) + "), start with:<br>";
    var links = [link("routeBuilder", "Build a " + P.duration + "-day route"), link("packages", "Explore packages"), link("groupCosting", "Calculate budget")].concat(suggestPackages(ids))
      .concat(ids.map(function (k) { return link("district:" + k); }));
    say(head + lines + "<br><small>" + note + "</small>", "bot", links);
    setChips([{ label: "Speak to a travel expert", cta: true, fn: function () { handoff("Please quote: " + ids.map(function (k) { return DISTRICTS[k].name; }).join(", ")); } },
      "cost-calc", "customize", { label: "Start over", fn: function () { session.plan = {}; persist(); planner(); } }]);
  }

  /* ================= 9. WIRING ================= */
  var greeted = false;
  function open() {
    panel.classList.add("open"); btn.style.display = "none";
    if (!greeted) {
      greeted = true;
      validateRegistry();
      var hi = GREETINGS[page.type] || GREETINGS.fallback;
      if (page.type === "district" && DISTRICTS[page.district]) hi = "You're reading about <b>" + DISTRICTS[page.district].name + "</b>. Want the best season, top sights, or a plan around it?";
      if (session.plan.interest || session.plan.duration) hi += "<br><small>Picking up your trip plan: " + esc(planSummary().join(", ")) + ".</small>";
      if (page.type === "packages") {
        var known = (session.plan.startPoint || "").toLowerCase();
        if (START_CITIES.indexOf(known) > -1) showPackages(known);
        else { say("Where will you start your trip? Pick a starting point and I'll show the matching packages.", "bot"); packageStart(true); }
      } else {
        say(hi, "bot");
        setChips(pageChips());
      }
    }
    input.focus();
  }
  function close() { panel.classList.remove("open"); btn.style.display = ""; btn.focus(); }
  btn.onclick = open;
  panel.querySelector("#hx-x").onclick = close;
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) close(); });
  panel.querySelector("#hx-form").onsubmit = function (e) { e.preventDefault(); var v = input.value.trim(); if (!v) return; input.value = ""; onText(v); };

  // Expose for the future dataset loader / Firebase sync
  window.HXBot = { FAQ: FAQ, PAGE_REGISTRY: PAGE_REGISTRY, DISTRICTS: DISTRICTS, session: function () { return session; } };
})();
