/**
 * package-data.js — SINGLE SOURCE OF TRUTH for package info
 * ─────────────────────────────────────────────────────────────────────────
 * Every page that needs package data (packages.html, package-detail.html,
 * booking.html, index.html) calls into this module instead of keeping its
 * own copy. There is exactly one place package data is fetched from:
 *
 *   Firebase RTDB  →  /templates_index   (identity: name, days, gateway,
 *                                          season, hotel star, tags, status,
 *                                          end_point, total_km_est, featured)
 *                  →  /package_content   (itinerary, inclusions, exclusions,
 *                                          image, route_stops, highlight)
 *
 * Pricing is NOT fetched here any more — every page calls
 * PricingEngine.computePrice() (assets/js/pricing-engine.js) instead. This
 * file used to also pull /package_pricing_matrix and /vehicle_rate_card and
 * attach a static budget_price_pp to each package; that was the old,
 * pre-PricingEngine pricing path and it's been removed so nothing on the
 * site can accidentally render a stale Firebase price again.
 *
 * If either the itinerary content or the identity metadata for a package is
 * ever wrong, fix it in Firebase — not in a page's JS. Do not reintroduce a
 * local PACKAGES / ITINERARIES / PKG_IMG array in any page; that's exactly
 * the duplication this file replaces.
 * ─────────────────────────────────────────────────────────────────────────
 */
(function (global) {
  "use strict";

  const DB_BASE = "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app";

  // In-memory cache so multiple widgets/scripts on the same page (or the
  // same page reloading a partial) don't each re-fetch. Cleared per page load.
  let _cachePromise = null;

  function _fetchJSON(path) {
    return fetch(DB_BASE + path + ".json")
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }

  /**
   * Merge one package's /templates_index + /package_content records into
   * the single normalized shape every page should render from.
   */
  function _normalize(id, idx, content) {
    idx = idx || {};
    content = content || {};
    return {
      id: id,
      package_id: id,
      name: idx.package_name || id,
      package_name: idx.package_name || id,
      days: idx.days || null,
      start_point: idx.start_point || "",
      end_point: idx.end_point || idx.start_point || "",
      status: idx.status || "active",
      tags: idx.tags || "",
      best_season: idx.best_season || "",
      hotel_star: idx.hotel_star || "",
      total_km_est: idx.total_km_est ?? null,
      featured: !!idx.featured,

      image: content.image || null,
      highlight: content.highlight || "",
      inclusions: content.inclusions || [],
      exclusions: content.exclusions || [],
      itinerary: content.itinerary || [],
      route_stops: content.route_stops || [],
    };
  }

  /**
   * Fetch + merge everything, once. Returns a Promise<{ packages, byId }>
   *   packages — array of normalized package objects (see _normalize)
   *   byId     — same data keyed by package_id for O(1) lookup
   */
  function load() {
    if (_cachePromise) return _cachePromise;

    _cachePromise = Promise.all([
      _fetchJSON("/templates_index"),
      _fetchJSON("/package_content"),
    ]).then(([templatesIndex, packageContent]) => {
      templatesIndex = templatesIndex || {};
      packageContent = packageContent || {};

      // Union of ids across both tables — a package missing from one side
      // (e.g. content not yet written) still shows up with whatever it has.
      const ids = new Set([
        ...Object.keys(templatesIndex),
        ...Object.keys(packageContent),
      ]);

      const byId = {};
      const packages = [];
      ids.forEach((id) => {
        const pkg = _normalize(id, templatesIndex[id], packageContent[id]);
        if (pkg.status !== "active") return; // hide draft/retired packages
        byId[id] = pkg;
        packages.push(pkg);
      });

      packages.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      return { packages: packages, byId: byId };
    });

    return _cachePromise;
  }

  /** Force the next load() to re-fetch instead of using the cache. */
  function invalidate() {
    _cachePromise = null;
  }

  /** Convenience: get one package by id (resolves null if not found). */
  function getById(id) {
    return load().then((data) => data.byId[id] || null);
  }

  global.PackageData = { load, getById, invalidate, DB_BASE };
})(window);
