/**
 * firebase-status-bar.js — small floating connectivity badge
 * ─────────────────────────────────────────────────────────────────────────
 * Drop <script src="assets/js/firebase-status-bar.js"></script> onto any
 * page. Shows a small dot (bottom-right) that goes green/yellow/red once
 * it's checked the Firebase paths that page's data depends on. Click it to
 * expand the full breakdown — same checks as firebase-status.html, just
 * inline on the page so you don't need a separate tab to debug "why isn't
 * this page loading its data" issues.
 *
 * Doesn't touch page layout (position: fixed, own z-index) and never
 * blocks anything — if fetches fail the rest of the page still works,
 * this just tells you where.
 * ─────────────────────────────────────────────────────────────────────────
 */
(function () {
  "use strict";

  const DB_BASE = "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app";

  // Which paths matter depends on the page. Override per-page by setting
  // window.FIREBASE_STATUS_PATHS = [...] before this script loads; otherwise
  // falls back to the common set every consolidated page depends on.
  const DEFAULT_PATHS = [
    { path: "/templates_index", label: "Package identity" },
    { path: "/package_content", label: "Itineraries/images" },
    { path: "/package_pricing_matrix", label: "Pricing" },
  ];

  const PATHS = (window.FIREBASE_STATUS_PATHS && window.FIREBASE_STATUS_PATHS.length)
    ? window.FIREBASE_STATUS_PATHS
    : DEFAULT_PATHS;

  const css = `
    #fb-status-badge { position:fixed; bottom:14px; right:14px; z-index:99999;
      font-family:-apple-system,Segoe UI,Roboto,sans-serif; font-size:12px; }
    #fb-status-pill { display:flex; align-items:center; gap:6px; background:#fff;
      border:1px solid #ddd; border-radius:20px; padding:6px 10px; cursor:pointer;
      box-shadow:0 2px 8px rgba(0,0,0,.12); color:#555; user-select:none; }
    #fb-status-pill:hover { box-shadow:0 3px 10px rgba(0,0,0,.18); }
    #fb-status-dot { width:9px; height:9px; border-radius:50%; background:#ccc; flex-shrink:0;
      transition:background .2s; }
    #fb-status-dot.ok { background:#2e9e4b; }
    #fb-status-dot.warn { background:#e0a500; }
    #fb-status-dot.fail { background:#d13c3c; }
    #fb-status-dot.pending { background:#ccc; animation:fb-pulse 1s infinite; }
    @keyframes fb-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
    #fb-status-panel { display:none; position:absolute; bottom:32px; right:0; width:280px;
      background:#fff; border:1px solid #ddd; border-radius:8px; box-shadow:0 4px 16px rgba(0,0,0,.15);
      padding:10px; }
    #fb-status-panel.open { display:block; }
    #fb-status-panel .row { display:flex; align-items:center; gap:8px; padding:5px 2px; border-bottom:1px solid #f2f2f2; }
    #fb-status-panel .row:last-child { border-bottom:none; }
    #fb-status-panel .dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    #fb-status-panel .dot.ok { background:#2e9e4b; }
    #fb-status-panel .dot.warn { background:#e0a500; }
    #fb-status-panel .dot.fail { background:#d13c3c; }
    #fb-status-panel .dot.pending { background:#ccc; }
    #fb-status-panel .txt { flex:1; min-width:0; }
    #fb-status-panel .path { font-family:ui-monospace,Menlo,monospace; font-size:10.5px; color:#333; }
    #fb-status-panel .detail { font-size:10px; color:#999; }
    #fb-status-panel .hdr { font-size:11px; font-weight:600; color:#333; margin-bottom:6px; }
  `;
  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const badge = document.createElement("div");
  badge.id = "fb-status-badge";
  badge.innerHTML = `
    <div id="fb-status-panel"></div>
    <div id="fb-status-pill">
      <div id="fb-status-dot" class="pending"></div>
      <span id="fb-status-label">Firebase</span>
    </div>
  `;
  document.body.appendChild(badge);

  const pill = badge.querySelector("#fb-status-pill");
  const panel = badge.querySelector("#fb-status-panel");
  const dot = badge.querySelector("#fb-status-dot");
  const label = badge.querySelector("#fb-status-label");

  pill.addEventListener("click", () => panel.classList.toggle("open"));
  document.addEventListener("click", (e) => {
    if (!badge.contains(e.target)) panel.classList.remove("open");
  });

  function worstState(states) {
    if (states.includes("fail")) return "fail";
    if (states.includes("warn")) return "warn";
    if (states.every((s) => s === "ok")) return "ok";
    return "pending";
  }

  async function checkPath(entry) {
    const started = performance.now();
    try {
      const res = await fetch(DB_BASE + entry.path + ".json");
      const ms = Math.round(performance.now() - started);
      if (!res.ok) return { state: "fail", detail: `HTTP ${res.status} (${ms}ms)` };
      const data = await res.json();
      if (data === null) return { state: "warn", detail: `empty (${ms}ms)` };
      const count = typeof data === "object" ? Object.keys(data).length : 1;
      return { state: "ok", detail: `${count} keys (${ms}ms)` };
    } catch (err) {
      return { state: "fail", detail: err.message || "network/CORS error" };
    }
  }

  async function run() {
    panel.innerHTML = `<div class="hdr">Checking ${PATHS.length} path(s)…</div>`;
    const results = await Promise.all(
      PATHS.map(async (entry) => ({ entry, ...(await checkPath(entry)) }))
    );

    const overall = worstState(results.map((r) => r.state));
    dot.className = overall;
    label.textContent =
      overall === "ok" ? "Firebase OK" : overall === "warn" ? "Firebase (empty data)" : "Firebase issue";

    panel.innerHTML =
      `<div class="hdr">Firebase — ${results.filter((r) => r.state === "ok").length}/${results.length} OK</div>` +
      results
        .map(
          (r) => `
        <div class="row">
          <div class="dot ${r.state}"></div>
          <div class="txt">
            <div class="path">${r.entry.path}</div>
            <div class="detail">${r.entry.label || ""} — ${r.detail}</div>
          </div>
        </div>`
        )
        .join("");

    if (overall === "fail") {
      panel.innerHTML += `<div class="detail" style="margin-top:6px;padding-top:6px;border-top:1px solid #f2f2f2;">
        Red = blocked or errored. Check Realtime Database → Rules for these paths (likely need ".read": true).</div>`;
    }
  }

  run();
})();
