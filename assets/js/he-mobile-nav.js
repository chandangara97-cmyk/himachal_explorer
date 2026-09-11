/* ============================================================
   HE-MOBILE-NAV — small mobile UX polish that layers on top of
   site-chrome.js's header/footer/bottom-nav. Adds: hide-header
   on scroll-down (mobile), a back-to-top button, and closing the
   open nav menu on Escape or an outside tap.
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

      // --- Hide header on scroll-down, reveal on scroll-up (mobile only) ---
      if(header){
        var lastY = window.scrollY, ticking = false;
        window.addEventListener('scroll', function(){
          if(ticking) return;
          ticking = true;
          requestAnimationFrame(function(){
            var y = window.scrollY;
            var navOpen = nav && nav.classList.contains('he-open');
            if(window.innerWidth <= 760 && !navOpen){
              if(y > lastY && y > 80){ header.classList.add('he-hide'); }
              else { header.classList.remove('he-hide'); }
            } else {
              header.classList.remove('he-hide');
            }
            lastY = y;
            ticking = false;
          });
        }, {passive:true});
      }

      // --- Close open mobile menu on Escape or outside click ---
      if(nav && burger){
        document.addEventListener('keydown', function(e){
          if(e.key === 'Escape' && nav.classList.contains('he-open')){
            nav.classList.remove('he-open');
            burger.classList.remove('he-open');
            burger.setAttribute('aria-expanded','false');
          }
        });
        document.addEventListener('click', function(e){
          if(!nav.classList.contains('he-open')) return;
          if(nav.contains(e.target) || burger.contains(e.target)) return;
          nav.classList.remove('he-open');
          burger.classList.remove('he-open');
          burger.setAttribute('aria-expanded','false');
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
        window.scrollTo({top:0, behavior:'smooth'});
      });
      window.addEventListener('scroll', function(){
        topBtn.classList.toggle('he-show', window.scrollY > 500);
      }, {passive:true});
    }, 0);
  });
})();
