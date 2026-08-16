/*!
 * Himachal Explorer — Package Route → Firebase Place Popup
 * ---------------------------------------------------------
 * Drop this file into:
 *   assets/js/package-route-place-popup.js
 *
 * It automatically:
 *  1. Loads the existing Firebase live-place modal if needed.
 *  2. Finds .route-step elements on package-detail.html.
 *  3. Makes every location clickable.
 *  4. Fetches the matching place from Firebase /places.
 *  5. Opens the premium live location modal.
 *
 * No change to package-detail.html is required if this file is loaded
 * with defer. It can also be pasted before </body>.
 */
(function () {
  'use strict';

  const MODAL_SRC = 'assets/js/place-live-modal.js';
  const DB = 'https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app';

  // Known route-name variations -> Firebase key candidates.
  const ALIASES = {
    'kaza': ['kaza'],
    'langza': ['langza', 'langza-village', 'langza_village'],
    'langza village': ['langza', 'langza-village', 'langza_village'],
    'hikkim': ['hikkim'],
    'komic': ['komic', 'komic-village', 'komik'],
    'kibber': ['kibber', 'kibber-village'],
    'kibber village': ['kibber', 'kibber-village'],
    'kunzum pass': ['kunzum-pass', 'kunzum_pass', 'kunzum'],
    'kunzum': ['kunzum-pass', 'kunzum_pass', 'kunzum'],
    'chandratal lake': ['chandratal-lake', 'chandratal_lake', 'chandratal'],
    'chandratal': ['chandratal-lake', 'chandratal_lake', 'chandratal'],
    'atal tunnel': ['atal-tunnel', 'atal_tunnel', 'atal-tunnel-rohtang'],
    'sissu': ['sissu', 'sissu-village', 'sissu-village-lahaul']
  };

  let modalReady = null;
  let placeIndexPromise = null;

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function slug(value) {
    return normalize(value).replace(/\s+/g, '-');
  }

  function loadModal() {
    if (typeof window.openLivePlaceCard === 'function') {
      return Promise.resolve();
    }

    if (modalReady) return modalReady;

    modalReady = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        'script[data-he-place-live-modal], script[src*="place-live-modal.js"]'
      );

      if (existing) {
        const check = () => {
          if (typeof window.openLivePlaceCard === 'function') resolve();
          else setTimeout(check, 50);
        };
        check();
        return;
      }

      const script = document.createElement('script');
      script.src = MODAL_SRC;
      script.defer = true;
      script.dataset.hePlaceLiveModal = 'true';
      script.onload = () => {
        const check = () => {
          if (typeof window.openLivePlaceCard === 'function') resolve();
          else setTimeout(check, 50);
        };
        check();
      };
      script.onerror = () => reject(new Error('Could not load place-live-modal.js'));
      document.head.appendChild(script);
    });

    return modalReady;
  }

  async function getPlaceIndex() {
    if (placeIndexPromise) return placeIndexPromise;

    placeIndexPromise = fetch(DB + '/places.json', {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    })
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null);

    return placeIndexPromise;
  }

  async function findFirebasePlace(name) {
    const clean = normalize(name);
    const candidates = [
      clean,
      slug(name),
      ...(ALIASES[clean] || [])
    ];

    // Fast path: try likely Firebase keys first.
    for (const key of [...new Set(candidates)]) {
      try {
        const res = await fetch(
          DB + '/places/' + encodeURIComponent(key) + '.json',
          { cache: 'no-store' }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            return { key, data };
          }
        }
      } catch (_) {}
    }

    // Fallback: read places once and match by name/title.
    const all = await getPlaceIndex();
    if (!all || typeof all !== 'object') return null;

    const wanted = new Set([
      clean,
      normalize(name.replace(/\bvillage\b/i, '')),
      ...((ALIASES[clean] || []).map(normalize))
    ]);

    for (const [key, value] of Object.entries(all)) {
      if (!value || typeof value !== 'object') continue;

      const names = [
        key,
        value.name,
        value.title,
        value.place_name,
        value.location_name,
        value.display_name
      ].filter(Boolean).map(normalize);

      if (names.some(n => wanted.has(n))) {
        return { key, data: value };
      }
    }

    // Softer contains-match for entries such as "Langza Village".
    for (const [key, value] of Object.entries(all)) {
      if (!value || typeof value !== 'object') continue;

      const names = [
        key, value.name, value.title, value.place_name, value.location_name
      ].filter(Boolean).map(normalize);

      if (names.some(n => n === clean || n.includes(clean) || clean.includes(n))) {
        return { key, data: value };
      }
    }

    return null;
  }

  function makeLocalSeed(name) {
    return {
      name,
      tagline: 'Loading the latest information for this destination…'
    };
  }

  function decorateStep(step) {
    if (!step || step.dataset.hePlacePopupBound === '1') return;

    const labelEl = step.querySelector('span');
    const name = (labelEl ? labelEl.textContent : step.textContent || '').trim();
    if (!name) return;

    step.dataset.hePlacePopupBound = '1';
    step.dataset.hePlaceName = name;
    step.setAttribute('role', 'button');
    step.setAttribute('tabindex', '0');
    step.setAttribute('aria-label', 'View information about ' + name);
    step.style.cursor = 'pointer';

    step.addEventListener('click', async function (event) {
      // Ignore clicks on actual links/buttons if the markup is later extended.
      if (event.target.closest('a,button')) return;

      await openFor(name);
    });

    step.addEventListener('keydown', async function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        await openFor(name);
      }
    });

    // Subtle visual affordance without changing the existing design.
    step.classList.add('he-place-clickable');
  }

  async function openFor(name) {
    try {
      await loadModal();

      // Show immediately, then replace with the exact Firebase record.
      if (typeof window.openLivePlaceCard === 'function') {
        window.openLivePlaceCard(slug(name), makeLocalSeed(name));
      }

      const match = await findFirebasePlace(name);

      if (!match) {
        // The live modal remains open with the location name.
        return;
      }

      // Open again with the actual Firebase key and full local seed.
      if (typeof window.openLivePlaceCard === 'function') {
        window.openLivePlaceCard(match.key, {
          ...match.data,
          name: match.data.name || name
        });
      }
    } catch (error) {
      console.warn('[HE route popup]', error);
    }
  }

  function bindRouteSteps(root) {
    (root || document)
      .querySelectorAll('.route-step')
      .forEach(decorateStep);
  }

  function start() {
    // Styling only; existing package-detail design remains unchanged.
    const style = document.createElement('style');
    style.textContent = `
      .route-step.he-place-clickable {
        cursor: pointer !important;
        -webkit-tap-highlight-color: transparent;
      }
      .route-step.he-place-clickable:focus-visible {
        outline: 2px solid var(--gold, #ad8140);
        outline-offset: 6px;
        border-radius: 10px;
      }
      .route-step.he-place-clickable img {
        transition: transform .3s ease, box-shadow .3s ease;
      }
      .route-step.he-place-clickable:hover img,
      .route-step.he-place-clickable:focus-visible img {
        transform: scale(1.08);
        box-shadow: 0 0 0 2px var(--gold, #ad8140),
                    0 14px 34px rgba(27,22,15,.16);
      }
    `;
    document.head.appendChild(style);

    bindRouteSteps(document);

    // package-detail can render/update the route after page load.
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            if (node.matches && node.matches('.route-step')) decorateStep(node);
            bindRouteSteps(node);
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
