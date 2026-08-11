/**
 * pkg-engine.js — Himachal Explorer package rendering engine
 * ─────────────────────────────────────────────────────────────────────────
 * Depends on (must be loaded first): packages-data.js, images.js
 *
 * Provides:
 *   resolveDayImage(day)          → best photo for one itinerary day
 *   resolveGallery(itinerary)     → deduped photo list for the whole trip
 *   resolveHeroImage(pkg)         → hero banner photo for a package
 *   estimatePrice(pkg, pax, tier) → dynamic per-person price
 *   buildFallbackPriceMatrix(pkg) → full gateway/pax/tier grid, same shape
 *                                   as the Firebase package_pricing_matrix
 *                                   record, so the UI code can treat a
 *                                   locally-estimated price exactly like a
 *                                   confirmed one.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── A small, varied set of real Himachal photos already used on this site
//    (Google Drive + the site's existing Unsplash hero image) so every day
//    of an itinerary shows *something* scenic even if we don't have an
//    exact-match photo for that specific village. ─────────────────────────
window.GENERIC_HP_IMAGES = (window.HERO_IMAGES || []).concat([
  "https://images.unsplash.com/photo-1544084944-15269ec7b5a0?q=80&w=1000&auto=format&fit=crop"
]);

// Approx coordinates for every curated hub town we have a real photo for.
// Used to pick the geographically NEAREST hub to a given place — far more
// accurate than a fixed "category → one hub" rule (which could put e.g.
// a Parvati Valley village on a Dharamshala photo just because both are
// tagged "spiritual").
const HUB_COORDS = {
  "Manali":       { lat: 32.2432, lng: 77.1892 },
  "Shimla":       { lat: 31.1048, lng: 77.1734 },
  "Kaza":         { lat: 32.2276, lng: 78.0716 },
  "Dharamshala":  { lat: 32.2190, lng: 76.3234 },
  "McLeod Ganj":  { lat: 32.2396, lng: 76.3217 },
  "Dalhousie":    { lat: 32.5387, lng: 75.9701 },
  "Kasol":        { lat: 32.0102, lng: 77.3152 },
  "Jibhi":        { lat: 31.5390, lng: 77.3860 },
  "Kalpa":        { lat: 31.5399, lng: 78.2583 },
  "Chitkul":      { lat: 31.3266, lng: 78.4324 },
  "Keylong":      { lat: 32.5730, lng: 77.0298 },
  "Narkanda":     { lat: 31.2685, lng: 77.4530 },
  "Palampur":     { lat: 32.1109, lng: 76.5363 },
  "Tosh":         { lat: 32.0453, lng: 77.3733 },
  "Sarahan":      { lat: 31.5167, lng: 77.8000 },
  "Chamba":       { lat: 32.5534, lng: 76.1258 },
  "Kullu":        { lat: 31.9592, lng: 77.1089 },
  "Bharmour":     { lat: 32.4439, lng: 76.5133 },
  "Delhi":        { lat: 28.7041, lng: 77.1025 },
  "Chandigarh":   { lat: 30.7333, lng: 76.7794 },
  "Amritsar":     { lat: 31.6340, lng: 74.8723 },
  "Dehradun":     { lat: 30.3165, lng: 78.0322 },
};

function _haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/**
 * Nearest curated hub town (by straight-line distance) to a place's
 * coordinates — geographically correct even when categories mismatch.
 */
function _nearestHubImage(lat, lng) {
  let best = null, bestDist = Infinity;
  for (const [hub, coord] of Object.entries(HUB_COORDS)) {
    const d = _haversine(lat, lng, coord.lat, coord.lng);
    if (d < bestDist) { bestDist = d; best = hub; }
  }
  if (!best) return null;
  return (window.DEST_IMAGES && window.DEST_IMAGES[best]) || (window.START_IMAGES && window.START_IMAGES[best]) || null;
}

function _simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

/**
 * Best-effort photo for a single itinerary day.
 * @param {{day:number, title:string, places:string[]}} day
 * @param {object} PLACES_MAP  defaults to window.PLACES
 */
function resolveDayImage(day, PLACES_MAP) {
  PLACES_MAP = PLACES_MAP || window.PLACES || {};
  const placeIds = day.places || [];

  // 1) Direct name match against curated destination/start images.
  for (const pid of placeIds) {
    const place = PLACES_MAP[pid];
    const name = place ? place.name : pid;
    for (const key of Object.keys(window.DEST_IMAGES || {})) {
      if (name && name.toLowerCase().includes(key.toLowerCase())) return window.DEST_IMAGES[key];
    }
    for (const key of Object.keys(window.START_IMAGES || {})) {
      if (name && name.toLowerCase().includes(key.toLowerCase())) return window.START_IMAGES[key];
    }
  }

  // 2) Also check the day title (e.g. "Manali → Lahaul Valley")
  for (const key of Object.keys(window.DEST_IMAGES || {})) {
    if (day.title && day.title.toLowerCase().includes(key.toLowerCase())) return window.DEST_IMAGES[key];
  }

  // 3) Geographic fallback — nearest curated hub town by real coordinates,
  //    so a place always borrows a photo from the correct valley/region
  //    even when its category tag doesn't line up with one fixed hub.
  for (const pid of placeIds) {
    const place = PLACES_MAP[pid];
    if (place && typeof place.lat === 'number' && typeof place.lng === 'number') {
      const img = _nearestHubImage(place.lat, place.lng);
      if (img) return img;
    }
  }

  // 4) Deterministic generic fallback — same day always gets the same
  //    photo, but different days of the same trip get visual variety.
  const pool = window.GENERIC_HP_IMAGES && window.GENERIC_HP_IMAGES.length
    ? window.GENERIC_HP_IMAGES
    : [window.FALLBACK_IMG];
  const idx = _simpleHash(day.title || String(day.day)) % pool.length;
  return pool[idx];
}

/**
 * Deduped gallery for the whole itinerary (used in the Photos section).
 */
function resolveGallery(itinerary, PLACES_MAP) {
  const seen = new Set();
  const out = [];
  (itinerary || []).forEach(day => {
    const img = resolveDayImage(day, PLACES_MAP);
    if (!seen.has(img)) { seen.add(img); out.push({ img, label: day.title || `Day ${day.day}` }); }
  });
  return out;
}

/**
 * Hero banner image for a package — uses day 1's photo when we have a
 * local itinerary, otherwise falls back to a keyword match on the name.
 */
function resolveHeroImage(pkg, itinerary) {
  if (itinerary && itinerary[0]) return resolveDayImage(itinerary[0]);
  const n = (pkg.package_name || '').toLowerCase();
  for (const key of Object.keys(window.DEST_IMAGES || {})) {
    if (n.includes(key.toLowerCase())) return window.DEST_IMAGES[key];
  }
  const pool = window.GENERIC_HP_IMAGES && window.GENERIC_HP_IMAGES.length ? window.GENERIC_HP_IMAGES : [window.FALLBACK_IMG];
  return pool[_simpleHash(pkg.package_id || n) % pool.length];
}

// ── Dynamic pricing model ───────────────────────────────────────────────
// Used whenever the live Firebase pricing sheet has no entry for a given
// package / gateway / group-size combination — which today is *always*
// true for packages that don't have a hand-entered pricing matrix yet.
// The model mirrors how these itineraries are actually costed: a private
// vehicle + driver (a mostly-fixed cost split across the group) plus
// per-person hotel nights, then a tier multiplier for hotel category.

const HOTEL_PP_PER_NIGHT = { "Standard": 1500, "3 Star": 2200, "4 Star": 3200, "Luxury": 4600 };
const TIER_MULT   = { budget: 1, premium: 1.25, luxury: 1.65 };
const PEAK_SURCHARGE = 0.12; // +12% in peak months

function _vehicleCostTotal(pkg) {
  const km = pkg.total_km_est || (pkg.days * 90);
  const perKm = km > 900 ? 16 : 13; // longer/high-altitude routes need tougher SUVs
  const driverAllowance = (pkg.days - 1) * 500; // night-halt + allowance
  return km * perKm + driverAllowance;
}

/**
 * Full cost breakdown for one gateway/pax/tier combination — same numbers
 * estimatePrice() uses internally, just not collapsed into a single total.
 * Powers the "see exactly where this money goes" cost-transparency ledger
 * on the package detail page.
 */
function estimateBreakdown(pkg, pax, tier, isPeak) {
  pax = Math.max(1, pax || 4);
  tier = tier || 'budget';
  const nights = Math.max(1, (pkg.days || 2) - 1);
  const hotelRate = HOTEL_PP_PER_NIGHT[pkg.hotel_star] || HOTEL_PP_PER_NIGHT['3 Star'];
  const hotelPP = hotelRate * nights;
  const vehiclePP = _vehicleCostTotal(pkg) / pax;
  const serviceFee = 0.10;
  const base = hotelPP + vehiclePP;
  const serviceAmt = base * serviceFee;
  const preTier = base + serviceAmt;
  const mult = (TIER_MULT[tier] || 1);
  const tierUpliftAmt = preTier * (mult - 1);
  let subtotal = preTier * mult;
  const peakAmt = isPeak ? subtotal * PEAK_SURCHARGE : 0;
  const total = Math.round((subtotal + peakAmt) / 50) * 50;
  return {
    nights, hotelRate, hotelPP: Math.round(hotelPP), vehiclePP: Math.round(vehiclePP),
    serviceAmt: Math.round(serviceAmt), tierUpliftAmt: Math.round(tierUpliftAmt),
    peakAmt: Math.round(peakAmt), total, tier, pax
  };
}

/**
 * Estimate a per-person price for one gateway/pax/tier combination.
 */
function estimatePrice(pkg, pax, tier, isPeak) {
  return estimateBreakdown(pkg, pax, tier, isPeak).total;
}

/**
 * Build a full pax(2-8) × tier(budget/premium/luxury) price block for one
 * gateway, in the same shape renderPricing() expects from Firebase:
 *   { "2": {budget, premium, luxury, budget_peak, ..., vehicle}, ... }
 */
function buildFallbackPriceMatrix(pkg, isPeak) {
  const paxRange = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const paxObj = {};
  paxRange.forEach(p => {
    paxObj[String(p)] = {
      budget:       estimatePrice(pkg, p, 'budget', false),
      premium:      estimatePrice(pkg, p, 'premium', false),
      luxury:       estimatePrice(pkg, p, 'luxury', false),
      budget_peak:  estimatePrice(pkg, p, 'budget', true),
      premium_peak: estimatePrice(pkg, p, 'premium', true),
      luxury_peak:  estimatePrice(pkg, p, 'luxury', true),
      vehicle: p <= 4 ? 'suv_innova' : (p <= 7 ? 'tempo_traveller_9' : 'tempo_traveller_12'),
    };
  });
  const gw = `${pkg.start_point || 'DELHI'}__${pkg.end_point || pkg.start_point || 'DELHI'}`;
  const out = {};
  out[gw] = { pax: paxObj, hotel_budget: HOTEL_PP_PER_NIGHT[pkg.hotel_star] || 2200, estimated: true };
  return out;
}

window.resolveDayImage = resolveDayImage;
window.resolveGallery = resolveGallery;
window.resolveHeroImage = resolveHeroImage;
window.estimatePrice = estimatePrice;
window.estimateBreakdown = estimateBreakdown;
window.buildFallbackPriceMatrix = buildFallbackPriceMatrix;
window.HUB_COORDS = HUB_COORDS;
