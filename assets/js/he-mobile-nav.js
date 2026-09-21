/* ============================================================
   HE-MOBILE-NAV — small mobile UX polish that layers on top of
   site-chrome.js's header/footer/bottom-nav. Adds: hide-header
   on scroll-down (mobile), a back-to-top button, and menu
   accessibility (Escape to close + focus return, focus trap,
   page scroll lock while the drawer is open).
   ============================================================ */
(function(){
  function ready(fn){
    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', fn); }
    else { fn(); }
  }

  ready(function(){
    // Wait one tick for site-chrome.js to have injected the header/footer.
    setTimeout(function(){
      var header = document.querySelector('.he-header');
      var nav = document.getElementById('he-nav-links');
      var burger = document.getElementById('he-burger');
      var root = document.documentElement;
      var mqMobile = window.matchMedia('(max-width: 900px)');   // must match the drawer breakpoint in site-chrome.css
      var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

      // --- Hide header on scroll-down, reveal on scroll-up (mobile only) ---
      if(header){
        var lastY = window.scrollY, ticking = false;
        var FORM_TAGS = {INPUT:1, TEXTAREA:1, SELECT:1};
        window.addEventListener('scroll', function(){
          if(ticking) return;
          ticking = true;
          requestAnimationFrame(function(){
            var y = window.scrollY;
            var navOpen = nav && nav.classList.contains('he-open');
            var formActive = document.activeElement && FORM_TAGS[document.activeElement.tagName];
            var delta = y - lastY;
            if(window.innerWidth <= 760 && !navOpen && !formActive){
              // Require a deliberate scroll (not a tiny jitter) and enough
              // distance from the top before hiding, so the header doesn't
              // flicker on small scrolls or while a map/panel is nudging
              // the page.
              if(delta > 12 && y > 200){ header.classList.add('he-hide'); }
              else if(delta < -12 || y < 200){ header.classList.remove('he-hide'); }
            } else {
              header.classList.remove('he-hide');
            }
            lastY = y;
            ticking = false;
          });
        }, {passive:true});
      }

      // --- Mobile menu: close on Escape / outside tap, return focus, trap focus, lock scroll ---
      if(nav && burger){
        burger.setAttribute('aria-controls', 'he-nav-links');

        function isOpen(){ return nav.classList.contains('he-open'); }

        function closeMenu(returnFocus){
          nav.classList.remove('he-open');
          burger.classList.remove('he-open');
          burger.setAttribute('aria-expanded','false');
          if(returnFocus) burger.focus();
        }

        // Keep the page-scroll lock in step with the drawer, however it was opened/closed
        // (site-chrome.js toggles the class; we just observe it).
        function syncMenuState(){
          var open = isOpen();
          if(open && !mqMobile.matches){ closeMenu(false); return; }   // resized up to desktop while open
          root.classList.toggle('he-menu-lock', open && mqMobile.matches);
        }
        new MutationObserver(syncMenuState).observe(nav, {attributes:true, attributeFilter:['class']});
        if(mqMobile.addEventListener){ mqMobile.addEventListener('change', syncMenuState); }
        else if(mqMobile.addListener){ mqMobile.addListener(syncMenuState); }

        // Opened from the keyboard -> move focus into the menu so Tab starts there.
        // (event.detail === 0 means the click came from Enter/Space, not a pointer.)
        burger.addEventListener('click', function(e){
          if(e.detail === 0 && isOpen()){
            var first = nav.querySelector('a[href]');
            if(first) first.focus();
          }
        });

        document.addEventListener('keydown', function(e){
          if(!isOpen()) return;
          if(e.key === 'Escape'){ closeMenu(true); return; }
          if(e.key !== 'Tab') return;
          // Trap Tab inside the drawer: burger (visually on top) then the links.
          var list = [burger].concat([].slice.call(nav.querySelectorAll('a[href]')));
          var i = list.indexOf(document.activeElement);
          var step = e.shiftKey ? -1 : 1;
          var next = (i === -1) ? (e.shiftKey ? list.length - 1 : 0)
                                : (i + step + list.length) % list.length;
          e.preventDefault();
          list[next].focus();
        });

        document.addEventListener('click', function(e){
          if(!isOpen()) return;
          if(nav.contains(e.target) || burger.contains(e.target)) return;
          closeMenu(false);   // pointer user tapped elsewhere: don't yank focus to the burger
        });
      }

      // --- Back-to-top button ---
      var topBtn = document.createElement('button');
      topBtn.type = 'button';
      topBtn.className = 'he-top-btn';
      topBtn.setAttribute('aria-label','Back to top');
      topBtn.innerHTML = '&uarr;';
      document.body.appendChild(topBtn);
      topBtn.addEventListener('click', function(){
        window.scrollTo({top:0, behavior: mqReduce.matches ? 'auto' : 'smooth'});
      });
      window.addEventListener('scroll', function(){
        topBtn.classList.toggle('he-show', window.scrollY > 500);
      }, {passive:true});
    }, 0);
  });
})();
