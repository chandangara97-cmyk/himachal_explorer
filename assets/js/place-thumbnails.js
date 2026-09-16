/*!
 * Himachal Explorer — Place Thumbnails
 * ------------------------------------------------------------------
 * Site-wide "every place name shown → a real photo of that place"
 * enhancement. Scans the page for two known patterns:
 *
 *   1. District pages:  <ul class="places-list"><li><strong>Name</strong>...
 *   2. Package detail:  <span class="place-pill" data-place-name="Name">
 *
 * For each, it resolves the place against Firebase `/places` (same
 * matching approach as package-route-place-popup.js), injects a small
 * thumbnail using the place's real photo, and falls back to a soft
 * category icon if no photo is on file. If place-live-modal.js is
 * also loaded on the page, clicking a place opens the full info card.
 *
 * Drop-in: <script src="assets/js/place-thumbnails.js" defer></script>
 * No other page changes required.
 * ------------------------------------------------------------------
 */
(function () {
  'use strict';

  const DB = 'https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app';
  const IMG_BASE = 'assets/images/';

  const CAT_ICONS = {
    'heritage': '🏛️', 'temple': '🛕', 'monastery': '☸️', 'viewpoint': '🏔️',
    'scenic': '🏔️', 'lake': '🌊', 'waterfall': '💦', 'trek': '🥾',
    'wildlife': '🐾', 'museum': '🏺', 'art-village': '🎨', 'adventure': '🪂',
    'culture': '🎭', 'hillstation': '🏔️', 'village': '🏘️', 'valley': '🏞️',
    'fort': '🏯', 'park': '🌳', 'spiritual': '🙏', 'default': '📍'
  };

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function slugify(value) {
    return normalize(value).replace(/\s+/g, '-');
  }

  let indexPromise = null;
  function getIndex() {
    if (indexPromise) return indexPromise;
    indexPromise = fetch(DB + '/places.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
    return indexPromise;
  }

  const cache = {};

  async function resolve(name) {
    const clean = normalize(name);
    if (Object.prototype.hasOwnProperty.call(cache, clean)) return cache[clean];

    try {
      const res = await fetch(DB + '/places/' + encodeURIComponent(slugify(name)) + '.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') { cache[clean] = { key: slugify(name), data: data }; return cache[clean]; }
      }
    } catch (_) { /* fall through to index lookup */ }

    const all = await getIndex();
    if (all && typeof all === 'object') {
      const wanted = new Set([clean, normalize(name.replace(/\bvillage\b/i, ''))]);
      for (const key of Object.keys(all)) {
        const value = all[key];
        if (!value || typeof value !== 'object') continue;
        const names = [key, value.name, value.title].filter(Boolean).map(normalize);
        if (names.some(function (n) { return wanted.has(n); })) {
          cache[clean] = { key: key, data: value }; return cache[clean];
        }
      }
      for (const key of Object.keys(all)) {
        const value = all[key];
        if (!value || typeof value !== 'object') continue;
        const n = normalize(value.name || key);
        if (n === clean || n.includes(clean) || clean.includes(n)) {
          cache[clean] = { key: key, data: value }; return cache[clean];
        }
      }
    }

    cache[clean] = null;
    return null;
  }

  function photoUrl(data) {
    if (!data) return '';
    if (Array.isArray(data.photos) && data.photos[0]) {
      const f = data.photos[0];
      return /^https?:\/\//.test(f) ? f : IMG_BASE + f;
    }
    const bare = data.photo_1 || data.photo_2 || data.photo_3 || data.photo_4;
    if (!bare) return '';
    return /^https?:\/\//.test(bare) ? bare : IMG_BASE + bare;
  }

  function injectStyles() {
    if (document.getElementById('he-place-thumb-styles')) return;
    const style = document.createElement('style');
    style.id = 'he-place-thumb-styles';
    style.textContent = `
.he-place-row{display:flex;gap:12px;align-items:flex-start;}
.he-thumb{width:56px;height:56px;border-radius:8px;overflow:hidden;flex-shrink:0;
  background:linear-gradient(135deg,#b07d3a,#1c1409);display:flex;align-items:center;
  justify-content:center;font-size:22px;line-height:1;}
.he-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.he-thumb-loading{background:linear-gradient(90deg,#e9e2d4 25%,#d8cfbd 37%,#e9e2d4 63%);
  background-size:400% 100%;animation:heThumbShimmer 1.4s ease infinite;}
@keyframes heThumbShimmer{0%{background-position:100% 0}100%{background-position:0 0}}
.he-place-row.he-clickable{cursor:pointer;}
.he-place-row.he-clickable:hover .he-thumb{box-shadow:0 0 0 2px var(--gold,#ad8140);}
.place-pill{position:relative;}
.he-pill-thumb{width:18px;height:18px;border-radius:50%;overflow:hidden;flex-shrink:0;
  display:inline-block;margin-right:6px;vertical-align:middle;background:#e9e2d4;}
.he-pill-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
    `.trim();
    document.head.appendChild(style);
  }

  function makeThumbEl(name, data, small) {
    const el = document.createElement('span');
    el.className = small ? 'he-pill-thumb' : 'he-thumb';
    const url = photoUrl(data);
    if (url) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = name;
      img.loading = 'lazy';
      img.onerror = function () {
        img.remove();
        if (!small) {
          el.textContent = CAT_ICONS[(data && data.category)] || CAT_ICONS.default;
        } else {
          el.remove();
        }
      };
      el.appendChild(img);
    } else if (!small) {
      el.textContent = CAT_ICONS[(data && data.category)] || CAT_ICONS.default;
    } else {
      return null; // no small placeholder icon for tiny pill thumbs — just omit
    }
    return el;
  }

  function wireClickToModal(row, key, name, data) {
    if (typeof window.openLivePlaceCard !== 'function') return;
    row.classList.add('he-clickable');
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');
    row.setAttribute('aria-label', 'View information about ' + name);
    const open = function () { window.openLivePlaceCard(key, Object.assign({ name: name }, data || {})); };
    row.addEventListener('click', open);
    row.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  }

  function enhanceListItem(li) {
    if (li.dataset.heThumbDone === '1') return;
    li.dataset.heThumbDone = '1';

    const strong = li.querySelector('strong');
    const name = strong ? strong.textContent.trim() : '';
    if (!name) return;

    li.classList.add('he-place-row');
    const slot = document.createElement('span');
    slot.className = 'he-thumb he-thumb-loading';
    li.insertBefore(slot, li.firstChild);

    resolve(name).then(function (match) {
      const data = match ? match.data : null;
      const finalThumb = makeThumbEl(name, data, false);
      slot.replaceWith(finalThumb);
      wireClickToModal(li, match ? match.key : slugify(name), name, data);
    });
  }

  function enhancePill(pill) {
    if (pill.dataset.heThumbDone === '1') return;
    pill.dataset.heThumbDone = '1';

    const name = pill.dataset.placeName || pill.textContent.trim();
    if (!name) return;

    resolve(name).then(function (match) {
      const data = match ? match.data : null;
      const thumb = makeThumbEl(name, data, true);
      if (thumb) pill.insertBefore(thumb, pill.firstChild);
    });
  }

  function enhanceRouteStepImage(step) {
    if (step.dataset.heThumbSwapped === '1') return;
    const img = step.querySelector('img');
    const nameEl = step.querySelector('span');
    const name = (nameEl ? nameEl.textContent : step.dataset.hePlaceName || '').trim();
    if (!img || !name) return;
    step.dataset.heThumbSwapped = '1';

    resolve(name).then(function (match) {
      const url = match ? photoUrl(match.data) : '';
      if (url) {
        const probe = new Image();
        probe.onload = function () { img.src = url; };
        probe.src = url; // only swap once the real photo is confirmed to load
      }
    });
  }

  function scan(root) {
    (root || document).querySelectorAll('.places-list li').forEach(enhanceListItem);
    (root || document).querySelectorAll('.place-pill').forEach(enhancePill);
    (root || document).querySelectorAll('.route-step').forEach(enhanceRouteStepImage);
  }

  function start() {
    injectStyles();
    scan(document);

    const observer = new MutationObserver(function (mutations) {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            if (node.matches) {
              if (node.matches('.place-pill')) enhancePill(node);
              else if (node.matches('.route-step')) enhanceRouteStepImage(node);
              else if (node.matches('.places-list li')) enhanceListItem(node);
            }
            scan(node);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
