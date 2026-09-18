/**
 * HX Lead Tracker
 * -----------------------------------------------------------------------
 * Drop this ONE script on every page (after Firebase is initialized, or
 * standalone — it uses the Firebase REST API so no SDK dependency).
 *
 * <script src="/js/hx-lead-tracker.js"></script>
 *
 * Then mark any WhatsApp CTA button/link with:
 *   data-hx-whatsapp
 *   data-hx-phone="917018138847"
 *   data-hx-message="Hello, I want help planning my Manali trip."
 *   data-hx-package="Manali-5D"      (optional)
 *   data-hx-destination="Manali"     (optional)
 *
 * Example:
 *   <a href="#" data-hx-whatsapp
 *      data-hx-phone="917018138847"
 *      data-hx-message="Hello, I want help planning my Himachal trip."
 *      data-hx-destination="Manali"
 *      data-hx-package="Manali-5D">
 *     Chat on WhatsApp
 *   </a>
 *
 * The script intercepts the click, creates/reuses a Lead ID, fires a
 * non-blocking Firebase write, injects "Reference: HX-L-..." into the
 * message, and opens wa.me immediately (write never delays the redirect).
 * -----------------------------------------------------------------------
 */
(function () {
  "use strict";

  // ---- CONFIG -----------------------------------------------------------
  // Fill in your actual Firebase Realtime Database REST base URL.
  // Project: garg-enterprise (asia-southeast1)
  var FIREBASE_DB_URL = "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app";

  var VISITOR_KEY = "hx_visitor_id";
  var FIRST_TOUCH_KEY = "hx_first_touch";
  var LEAD_KEY_PREFIX = "hx_lead_"; // one active lead id per destination/package context, plus a global fallback

  // ---- UTILITIES ----------------------------------------------------------
  function randomBase36(len) {
    var out = "";
    while (out.length < len) {
      out += Math.random().toString(36).slice(2);
    }
    return out.slice(0, len).toUpperCase();
  }

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

  function todayStamp() {
    var d = new Date();
    return d.getFullYear() + "" + pad2(d.getMonth() + 1) + pad2(d.getDate());
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* storage unavailable — degrade silently */ }
  }

  function getQueryParam(name) {
    try {
      var url = new URL(window.location.href);
      return url.searchParams.get(name);
    } catch (e) { return null; }
  }

  // ---- VISITOR ID (anonymous, persistent across sessions) -----------------
  function getVisitorId() {
    var existing = safeGet(VISITOR_KEY);
    if (existing) return existing;
    var id = "HX-V-" + randomBase36(10);
    safeSet(VISITOR_KEY, id);
    return id;
  }

  // ---- FIRST-TOUCH ATTRIBUTION (captured once, never overwritten) ---------
  function captureFirstTouch() {
    var existing = safeGet(FIRST_TOUCH_KEY);
    if (existing) {
      try { return JSON.parse(existing); } catch (e) { /* fall through and recapture */ }
    }

    var ref = document.referrer || "";
    var source = "direct";
    var medium = "none";

    var utmSource = getQueryParam("utm_source");
    var utmMedium = getQueryParam("utm_medium");

    if (utmSource) {
      source = utmSource;
      medium = utmMedium || "campaign";
    } else if (ref) {
      if (/google\./i.test(ref)) { source = "google"; medium = "organic"; }
      else if (/bing\./i.test(ref)) { source = "bing"; medium = "organic"; }
      else if (/facebook\.|instagram\./i.test(ref)) { source = "meta"; medium = "social"; }
      else if (/whatsapp\./i.test(ref)) { source = "whatsapp"; medium = "referral"; }
      else {
        try { source = new URL(ref).hostname; } catch (e) { source = "referral"; }
        medium = "referral";
      }
    }

    var touch = {
      first_source: source,
      first_medium: medium,
      first_landing_page: window.location.pathname,
      first_seen_at: new Date().toISOString()
    };

    safeSet(FIRST_TOUCH_KEY, JSON.stringify(touch));
    return touch;
  }

  // ---- LEAD ID (created on commercial-intent click; timestamp-based, no counter/race) --
  function generateLeadId() {
    return "HX-L-" + new Date().getFullYear() + "-" + todayStamp().slice(4) + "-" + randomBase36(6);
    // e.g. HX-L-2026-0917-4F2A1B  (year - MMDD - random suffix)
  }

  function getOrCreateLeadId(contextKey) {
    var storageKey = LEAD_KEY_PREFIX + (contextKey || "default");
    var existing = safeGet(storageKey);
    if (existing) return existing;
    var id = generateLeadId();
    safeSet(storageKey, id);
    return id;
  }

  // ---- FIREBASE WRITE (fire-and-forget, never blocks the redirect) --------
  function writeLead(leadId, data) {
    if (!FIREBASE_DB_URL || FIREBASE_DB_URL.indexOf("YOUR-PROJECT") !== -1) return;
    var url = FIREBASE_DB_URL + "/leads/" + encodeURIComponent(leadId) + ".json";
    try {
      fetch(url, {
        method: "PATCH", // merge, so repeat clicks update rather than overwrite the record
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true // survives the page navigating away to WhatsApp
      }).catch(function () { /* network hiccup — never block the user on this */ });
    } catch (e) { /* ignore — tracking must never break the CTA */ }
  }

  // ---- WHATSAPP CTA WIRING -------------------------------------------------
  function buildWaUrl(phone, message) {
    return "https://wa.me/" + phone.replace(/\D/g, "") + "?text=" + encodeURIComponent(message);
  }

  // Core logic shared by both entry points below: the declarative
  // data-hx-whatsapp click handler, and the imperative HX.openWhatsApp()
  // call for pages that build their wa.me URL in inline JS.
  function trackAndOpen(phone, baseMessage, context) {
    context = context || {};
    var destination = context.destination || null;
    var pkg = context.package || null;

    // One Lead ID per visitor, site-wide — not per destination/package.
    // A visitor comparing Manali and Shimla before messaging you is one
    // deal, not two; fragmenting by page would split a single sales
    // conversation across multiple CRM records. The destination/package
    // that triggered THIS click is still recorded, and updates on later
    // clicks, so you always see what the visitor is currently interested in.
    var contextKey = "default";

    var visitorId = getVisitorId();
    var firstTouch = captureFirstTouch();
    var leadId = getOrCreateLeadId(contextKey);
    var isFirstClick = !safeGet("hx_lead_seen_" + leadId);
    safeSet("hx_lead_seen_" + leadId, "1");

    var record = {
      lead_id: leadId,
      visitor_id: visitorId,
      first_source: firstTouch.first_source,
      first_medium: firstTouch.first_medium,
      first_landing_page: firstTouch.first_landing_page,
      last_destination_viewed: destination,
      last_package_viewed: pkg,
      whatsapp_started: true,
      last_whatsapp_click_at: new Date().toISOString(),
      attribution_status: (firstTouch.first_source === "direct") ? "unattributed" : "attributed"
    };

    // Only set status to NEW on the very first click for this lead —
    // subsequent clicks (different pages, same visitor) must never
    // reset a lead that's already progressed past NEW in the CRM.
    if (isFirstClick) {
      record.status = "NEW";
      record.created_at = new Date().toISOString();
    }

    // Fire the write BEFORE opening WhatsApp, but don't await it.
    writeLead(leadId, record);

    var message = baseMessage + "\n\nReference: " + leadId;
    var waUrl = buildWaUrl(phone, message);

    // Open immediately — the fetch above is non-blocking (fire-and-forget).
    window.open(waUrl, "_blank");
    return waUrl;
  }

  function handleWhatsAppClick(el, evt) {
    evt.preventDefault();
    var phone = el.getAttribute("data-hx-phone") || "917018138847";
    var baseMessage = el.getAttribute("data-hx-message") || "Hello, I want help planning my Himachal trip.";
    trackAndOpen(phone, baseMessage, {
      destination: el.getAttribute("data-hx-destination"),
      package: el.getAttribute("data-hx-package")
    });
  }

  function attachAll() {
    var nodes = document.querySelectorAll("[data-hx-whatsapp]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.getAttribute("data-hx-bound") === "1") continue; // avoid double-binding on re-scans
      el.setAttribute("data-hx-bound", "1");
      el.addEventListener("click", function (evt) {
        handleWhatsAppClick(evt.currentTarget, evt);
      });
    }
  }

  // Capture first-touch as early as possible, even before any click.
  document.addEventListener("DOMContentLoaded", function () {
    captureFirstTouch();
    attachAll();
  });

  // Expose for pages that inject WhatsApp buttons dynamically (e.g. after
  // a Firebase fetch renders package cards) — call HX.rescan() after render.
  window.HX = window.HX || {};
  window.HX.rescan = attachAll;
  window.HX.getVisitorId = getVisitorId;
  window.HX.getOrCreateLeadId = getOrCreateLeadId;
  // For pages that build the wa.me URL themselves in inline JS (booking.html,
  // taxi-service.html, yui.html) instead of a static <a data-hx-whatsapp>:
  // call this in place of window.open(`https://wa.me/${num}?text=${msg}`)
  // and it returns the tracked URL, does the same lead write, and opens it.
  //   window.HX.openWhatsApp("917018138847", "Hi, I want to book...", { destination: "Manali" });
  window.HX.openWhatsApp = trackAndOpen;
})();
