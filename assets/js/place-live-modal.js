/*!
 * Himachal Explorer — Live Place Modal
 * ------------------------------------------------------------------
 * Site-wide "click a location → see its live Firebase details" modal.
 * Same pattern used on package-detail.html: show whatever we already
 * have instantly, then refresh from the `places` node in Firebase so
 * the modal always reflects the latest saved data.
 *
 * Usage (any page, after including this file):
 *   <script src="assets/js/place-live-modal.js" defer></script>
 *   ...
 *   openLivePlaceCard('andretta');            // fetch fresh, no local data yet
 *   openLivePlaceCard('andretta', placeObj);   // show placeObj instantly, then refresh
 *
 * `placeObj`, if passed, can use either schema found in the data:
 *   - photo_1..photo_4 (bare filenames or full URLs)
 *   - photos: [ "file1.jpg", ... ]
 * ------------------------------------------------------------------
 */
(function () {
  const DB = 'https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app';
  const IMG_BASE = 'assets/images/';

  const CAT_ICONS = {
    'heritage': '🏛️', 'temple': '🛕', 'monastery': '☸️', 'viewpoint': '🏔️',
    'scenic': '🏔️', 'lake': '🌊', 'waterfall': '💦', 'trek': '🥾',
    'wildlife': '🐾', 'museum': '🏺', 'art-village': '🎨', 'adventure': '🪂',
    'culture': '🎭', 'default': '📍'
  };

  let _injected = false;
  let _reqId = 0;
  const _cache = {};

  function injectOnce() {
    if (_injected) return;
    _injected = true;

    const style = document.createElement('style');
    style.textContent = `
.lpm-overlay{position:fixed;inset:0;z-index:99998;background:rgba(10,7,4,.72);
  display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);}
.lpm-overlay.open{display:flex;}
.lpm-modal{width:100%;max-width:420px;max-height:86vh;overflow-y:auto;background:#fffdf9;
  border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,.4);position:relative;
  font-family:'DM Sans','Outfit',sans-serif;}
.lpm-img-wrap{position:relative;width:100%;height:190px;background:#e9e2d4;overflow:hidden;}
.lpm-img{width:100%;height:100%;object-fit:cover;display:block;}
.lpm-close{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;
  background:rgba(10,7,4,.55);color:#fff;border:none;cursor:pointer;font-size:16px;
  display:flex;align-items:center;justify-content:center;z-index:2;}
.lpm-body{padding:18px 20px 22px;}
.lpm-cat{font-size:9px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;
  color:#b07d3a;margin-bottom:6px;}
.lpm-name{font-family:'Cormorant',serif;font-size:24px;color:#1c1409;font-weight:500;
  line-height:1.15;margin-bottom:6px;}
.lpm-meta{font-size:10.5px;color:#7a7266;letter-spacing:.04em;margin-bottom:12px;}
.lpm-tagline{font-size:13px;color:#3a352c;line-height:1.65;}
.lpm-row{display:flex;align-items:center;gap:6px;font-size:11px;color:#5a5346;margin-top:8px;}
.lpm-nav-btn{margin-top:16px;display:inline-flex;align-items:center;gap:6px;
  background:#1c1409;color:#fff;padding:9px 16px;border-radius:8px;font-size:12px;
  font-weight:600;text-decoration:none;}
.lpm-live-note{display:flex;align-items:center;gap:6px;font-size:9.5px;color:#8a8272;
  margin-top:14px;font-style:italic;}
.lpm-live-dot{width:6px;height:6px;border-radius:50%;background:#b07d3a;flex-shrink:0;
  animation:lpmDot 1.2s ease-out infinite;}
@keyframes lpmDot{0%{opacity:1;transform:scale(1);}70%{opacity:.25;transform:scale(1.8);}100%{opacity:0;transform:scale(2.2);}}
.lpm-skel{background:linear-gradient(90deg,#e9e2d4 25%,#d8cfbd 37%,#e9e2d4 63%);
  background-size:400% 100%;animation:lpmShimmer 1.4s ease infinite;}
@keyframes lpmShimmer{0%{background-position:100% 0}100%{background-position:0 0}}
    `.trim();
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'lpm-overlay';
    overlay.id = 'lpm-overlay';
    overlay.innerHTML = `<div class="lpm-modal" id="lpm-modal"></div>`;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLivePlaceCard(); });
    document.body.appendChild(overlay);

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLivePlaceCard(); });
  }

  function resolvePhoto(data) {
    if (!data) return '';
    if (Array.isArray(data.photos) && data.photos[0]) {
      const f = data.photos[0];
      return /^https?:\/\//.test(f) ? f : IMG_BASE + f;
    }
    const bare = data.photo_1 || data.photo_2 || data.photo_3 || data.photo_4;
    if (bare) return /^https?:\/\//.test(bare) ? bare : IMG_BASE + bare;
    return '';
  }

  function render(pid, data, loading) {
    const modal = document.getElementById('lpm-modal');
    if (!modal) return;
    const icon = CAT_ICONS[data.category] || CAT_ICONS.default;
    const photo = resolvePhoto(data);
    const name = (data.name || pid || '').replace(/"/g, '');
    const coordsOk = data.latitude != null && data.longitude != null;
    const coords = coordsOk
      ? `<div class="lpm-row">📍 ${(+data.latitude).toFixed(4)}°N, ${(+data.longitude).toFixed(4)}°E</div>`
      : '';
    const navBtn = coordsOk
      ? `<a class="lpm-nav-btn" href="https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}" target="_blank" rel="noopener">🧭 Navigate to ${name || 'this place'}</a>`
      : '';

    modal.innerHTML = `
      <button type="button" class="lpm-close" onclick="closeLivePlaceCard()" aria-label="Close">✕</button>
      <div class="lpm-img-wrap${photo ? '' : ' lpm-skel'}">
        ${photo ? `<img class="lpm-img" src="${photo}" alt="${name}" onerror="this.parentElement.classList.add('lpm-skel');this.remove()"/>`
                 : `<div class="lpm-img" style="display:flex;align-items:center;justify-content:center;font-size:44px;background:linear-gradient(135deg,#b07d3a,#1c1409)">${icon}</div>`}
      </div>
      <div class="lpm-body">
        <div class="lpm-cat">${icon} ${data.category || data.segment || 'Destination'}</div>
        <div class="lpm-name">${name || pid}</div>
        <div class="lpm-meta">${[data.district, data.region].filter(Boolean).join(' · ') || '—'}</div>
        <div class="lpm-tagline">${data.history_tagline || data.tagline || data.what_you_find || 'More details for this place are on the way.'}</div>
        ${coords}
        ${navBtn}
        <div class="lpm-live-note">
          ${loading ? '<span class="lpm-live-dot"></span> Refreshing latest details from Firebase…' : '✓ Showing the latest saved details'}
        </div>
      </div>`;
  }

  async function fetchLive(pid) {
    if (Object.prototype.hasOwnProperty.call(_cache, pid)) return _cache[pid];
    try {
      const res = await fetch(`${DB}/places/${encodeURIComponent(pid)}.json`);
      const data = res.ok ? await res.json() : null;
      _cache[pid] = data;
      return data;
    } catch (err) {
      console.warn('[place-live-modal] fetch failed for', pid, err);
      _cache[pid] = null;
      return null;
    }
  }

  window.openLivePlaceCard = function (pid, localData) {
    injectOnce();
    const reqId = ++_reqId;
    const overlay = document.getElementById('lpm-overlay');
    overlay.classList.add('open');
    const seed = localData || { name: pid };
    render(pid, seed, true);

    fetchLive(pid).then((live) => {
      if (reqId !== _reqId) return; // a newer place was opened meanwhile
      const merged = live ? Object.assign({}, seed, live) : seed;
      render(pid, merged, false);
    });
  };

  window.closeLivePlaceCard = function () {
    const overlay = document.getElementById('lpm-overlay');
    if (overlay) overlay.classList.remove('open');
  };
})();
