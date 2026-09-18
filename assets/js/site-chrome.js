/* ============================================================
   SITE CHROME — injects a consistent header + footer on every
   page that includes this script plus <div id="site-header">
   and/or <div id="site-footer"> placeholders.
   ============================================================ */
(function(){
  // Mark the page for the shared responsive design system and load it once.
  try {
    document.documentElement.classList.add('he-ui-ready');
    if(document.body) document.body.classList.add('he-unified-page');
  } catch(e) {}
  if(!document.getElementById('he-unified-css')){
    var uiCss=document.createElement('link');
    uiCss.id='he-unified-css'; uiCss.rel='stylesheet'; uiCss.href='/assets/css/he-unified.css';
    document.head.appendChild(uiCss);
  }
  if(!document.getElementById('he-theme-v2-css')){
    var v2Css=document.createElement('link');
    v2Css.id='he-theme-v2-css'; v2Css.rel='stylesheet'; v2Css.href='/assets/css/theme-v2.css';
    document.head.appendChild(v2Css);
  }
  if(!document.getElementById('he-cormorant-font')){
    var cormorant=document.createElement('link');
    cormorant.id='he-cormorant-font'; cormorant.rel='stylesheet';
    cormorant.href='https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Jost:wght@400;500;600;700&display=swap';
    document.head.appendChild(cormorant);
  }
  // Apply saved theme immediately (before header/footer render) to avoid flicker.
  try{
    var savedTheme = localStorage.getItem('he-theme');
    if(!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
      savedTheme = 'dark';
    }
    if(savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  }catch(e){}

  // Ensure JetBrains Mono is available for the header/footer micro-labels
  // (matches the type system used in yui.html's Route Builder toolbar).
  if(!document.getElementById('he-mono-font')){
    var fontLink = document.createElement('link');
    fontLink.id = 'he-mono-font';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap';
    document.head.appendChild(fontLink);
  }

  var NAV_LINKS = [
    {href:'/index.html',          label:'Home'},
    {href:'/dist_master.html',     label:'Destinations', tip:'Browse all 12 Himachal districts — see top places, hotels, food and travel tips for each.'},
    {href:'/booking.html',        label:'Booking', tip:'Book a package: pick dates, travellers and hotel tier, then pay or reserve via WhatsApp.'},
    {href:'/encyclopedia.html',   label:'Encyclopedia', tip:'A searchable guide to Himachal\u2019s places, treks, lakes and monasteries — for research before you book.'},
    {href:'/blog/index.html',     label:'Blog', tip:'Travel guides and trip stories — best time to visit, road trip routes, and local tips.'},
    {href:'/about.html',          label:'About'},
    {href:'/contact.html',        label:'Contact'}
  ];

  var FOOT_LINKS = [
    {href:'/index.html',       label:'Home'},
    {href:'/dist_master.html',  label:'Destinations'},
    {href:'/booking.html',     label:'Booking'},
    {href:'/encyclopedia.html',label:'Encyclopedia'},
    {href:'/blog/index.html',  label:'Blog'},
    {href:'/about.html',       label:'About'},
    {href:'/contact.html',     label:'Contact'},
    {href:'https://www.instagram.com/himachalexplorer', label:'Instagram', ext:true},
    {href:'https://wa.me/917018138847', label:'WhatsApp', ext:true}
  ];

  function currentFile(){
    var p = location.pathname.split('/').pop();
    return p === '' ? 'index.html' : p;
  }

  function renderHeader(){
    var mount = document.getElementById('site-header');
    if(!mount) return;
    var here = currentFile();
    var isIndex = (here === 'index.html');

    var linksHTML = NAV_LINKS.map(function(l){
      var linkFile = l.href.split('/').pop();
      var active = (linkFile === here) ? ' he-active' : '';
      var current = (linkFile === here) ? ' aria-current="page"' : '';
      var tip = l.tip ? ' data-hx-tip="'+l.tip.replace(/"/g,'&quot;')+'"' : '';
      return '<a href="'+l.href+'" class="he-nav-links-item'+active+'"'+current+tip+'>'+l.label+'</a>';
    }).join('');

    var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

    // Every page — including the homepage — gets the same full nav header,
    // matching the site-wide redesign (navy header, gold CTA).
    mount.innerHTML =
      '<header class="he-header he-visible">'+
        '<a href="/index.html" class="he-logo">'+
          '<img src="/logo-512.png" alt="Himachal Explorer logo" class="he-logo-img" width="34" height="34">'+
          '<span class="he-logo-text">HimachalExplorer<em>.in</em></span>'+
        '</a>'+
        '<nav class="he-nav-links" id="he-nav-links" aria-label="Main navigation">'+linksHTML+'</nav>'+
        '<div class="he-right">'+
          '<div class="he-seg" role="group" aria-label="Theme">'+
            '<button type="button" id="he-theme-light" class="'+(theme==='light'?'he-active':'')+'">☀ Light</button>'+
            '<button type="button" id="he-theme-dark" class="'+(theme==='dark'?'he-active':'')+'">☾ Dark</button>'+
          '</div>'+
          '<a href="tel:+917018138847" class="he-phone" data-hx-tip="Call us directly to talk through your trip with a real person.">'+
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12.36a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.41 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'+
            '+91-70181 38847'+
          '</a>'+
          '<a href="/packages.html" class="he-cta" data-hx-tip="Browse ready-made Himachal tour packages with pricing, or build your own route.">Plan Your Trip</a>'+
          '<button type="button" class="he-burger" id="he-burger" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>'+
        '</div>'+
      '</header>'+
      '<div class="he-header-spacer" id="he-header-spacer" aria-hidden="true"></div>';

    function setTheme(next){
      document.documentElement.setAttribute('data-theme', next);
      try{ localStorage.setItem('he-theme', next); }catch(e){}
      var lightBtn = document.getElementById('he-theme-light');
      var darkBtn = document.getElementById('he-theme-dark');
      if(lightBtn) lightBtn.classList.toggle('he-active', next === 'light');
      if(darkBtn) darkBtn.classList.toggle('he-active', next === 'dark');
    }
    var lightBtn = document.getElementById('he-theme-light');
    var darkBtn = document.getElementById('he-theme-dark');
    if(lightBtn) lightBtn.addEventListener('click', function(){ setTheme('light'); });
    if(darkBtn) darkBtn.addEventListener('click', function(){ setTheme('dark'); });

    var burger = document.getElementById('he-burger');
    var navEl = document.getElementById('he-nav-links');
    burger.addEventListener('click', function(){
      var open = navEl.classList.toggle('he-open');
      burger.classList.toggle('he-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    var navAnchors = navEl.getElementsByTagName('a');
    for(var i=0;i<navAnchors.length;i++){
      navAnchors[i].addEventListener('click', function(){
        navEl.classList.remove('he-open');
        burger.classList.remove('he-open');
        burger.setAttribute('aria-expanded','false');
      });
    }

    // Size the spacer to the header's real (wrapping-aware) height and keep it in sync.
    var headerEl = mount.querySelector('.he-header');
    var spacerEl = document.getElementById('he-header-spacer');
    function syncSpacer(){
      if(headerEl && spacerEl) spacerEl.style.height = headerEl.getBoundingClientRect().height + 'px';
    }
    syncSpacer();
    window.addEventListener('resize', syncSpacer);
    if(window.ResizeObserver) new ResizeObserver(syncSpacer).observe(headerEl);
  }

  function renderFooter(){
    var mount = document.getElementById('site-footer');
    if(!mount) return;
    var linksHTML = FOOT_LINKS.map(function(l){
      var extra = l.ext ? ' target="_blank" rel="noopener"' : '';
      return '<li><a href="'+l.href+'"'+extra+'>'+l.label+'</a></li>';
    }).join('');
    mount.innerHTML =
      '<footer class="he-footer">'+
        '<div class="he-footer-inner">'+
          '<div class="he-foot-brand">HimachalExplorer<em>.in</em><span>Explore · Discover · Experience</span></div>'+
          '<ul class="he-foot-links">'+linksHTML+'</ul>'+
          '<div class="he-foot-copy">© 2026 Himachal Explorer · Garg Enterprise · +91-70181 38847</div>'+
        '</div>'+
      '</footer>';
  }

  function renderMobileBottom(){
    if(document.querySelector('.he-mobile-bottom')) return;
    var here=currentFile();
    var items=[
      {href:'/index.html',icon:'⌂',label:'Home',match:'index.html'},
      {href:'/dist_master.html',icon:'⌖',label:'Explore',match:'dist_master.html',tip:'Browse all 12 districts and their top places.'},
      {href:'/booking.html',icon:'▣',label:'Booking',match:'booking.html',tip:'Book a package or reserve a hotel.'},
      {href:'/encyclopedia.html',icon:'▤',label:'Encyclopedia',match:'encyclopedia.html',tip:'Look up any place, trek or lake in Himachal.'},
      {href:'/packages.html',icon:'⋯',label:'More',match:'packages.html',tip:'See ready-made tour packages with pricing.'}
    ];
    var html='<nav class="he-mobile-bottom" aria-label="Mobile navigation"><div class="he-mobile-bottom-inner">';
    items.forEach(function(it){
      var active=here===it.match?' he-mob-active':'';
      var tip = it.tip ? ' data-hx-tip="'+it.tip.replace(/"/g,'&quot;')+'"' : '';
      html+='<a class="'+active+'" href="'+it.href+'"'+tip+'><span class="he-mob-icon">'+it.icon+'</span><span>'+it.label+'</span></a>';
    });
    html+='</div></nav>';
    document.body.insertAdjacentHTML('beforeend',html);
  }

  // FUNCTION TIPS — hover (desktop), focus (keyboard), or tap (touch) on any
  // element carrying data-hx-tip shows a short "what this does" explanation.
  // Delegated on document so it works for the header/footer/mobile-nav here
  // AND for any page-specific element (e.g. a Route Builder button) that
  // adds the same attribute — no per-page wiring needed.
  function initHxTips(){
    if(window.__heTipInit) return;
    window.__heTipInit = true;

    var tipEl = document.createElement('div');
    tipEl.className = 'he-tip';
    tipEl.setAttribute('role','tooltip');
    document.body.appendChild(tipEl);

    var showTimer, hideTimer;

    function position(target){
      var r = target.getBoundingClientRect();
      var tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
      var vw = window.innerWidth, vh = window.innerHeight;
      var top = r.bottom + 10, above = false;
      if(top + th > vh - 8){ top = r.top - th - 10; above = true; }
      var left = Math.max(8, Math.min(r.left + r.width/2 - tw/2, vw - tw - 8));
      tipEl.style.left = left + 'px';
      tipEl.style.top = Math.max(8, top) + 'px';
      tipEl.classList.toggle('he-tip-above', above);
      var arrowLeft = Math.max(12, Math.min(r.left + r.width/2 - left, tw - 12));
      tipEl.style.setProperty('--he-tip-arrow', arrowLeft + 'px');
    }

    function show(target){
      var text = target.getAttribute('data-hx-tip');
      if(!text) return;
      clearTimeout(hideTimer);
      tipEl.textContent = text;
      tipEl.classList.add('he-tip-show'); // laid out (but transparent) so offsetWidth/Height are real before positioning
      position(target);
    }
    function hide(){ tipEl.classList.remove('he-tip-show'); }

    document.addEventListener('pointerover', function(e){
      if(e.pointerType !== 'mouse') return;
      var t = e.target.closest && e.target.closest('[data-hx-tip]');
      if(!t) return;
      clearTimeout(showTimer);
      showTimer = setTimeout(function(){ show(t); }, 180);
    });
    document.addEventListener('pointerout', function(e){
      if(e.pointerType !== 'mouse') return;
      if(!(e.target.closest && e.target.closest('[data-hx-tip]'))) return;
      clearTimeout(showTimer);
      hideTimer = setTimeout(hide, 120);
    });
    document.addEventListener('focusin', function(e){
      var t = e.target.closest && e.target.closest('[data-hx-tip]');
      if(t) show(t);
    });
    document.addEventListener('focusout', function(e){
      if(e.target.closest && e.target.closest('[data-hx-tip]')) hide();
    });

    // Touch: first tap shows the explanation and holds the link; tapping the
    // same target again (or after it re-primes) lets the tap through.
    document.addEventListener('click', function(e){
      var t = e.target.closest && e.target.closest('[data-hx-tip]');
      if(!t || !window.matchMedia || !matchMedia('(hover: none)').matches) return;
      if(t.__heTipPrimed){
        t.__heTipPrimed = false;
        hide();
        return; // let the tap through this time
      }
      e.preventDefault();
      show(t);
      t.__heTipPrimed = true;
      clearTimeout(t.__heTipPrimeTimer);
      t.__heTipPrimeTimer = setTimeout(function(){ t.__heTipPrimed = false; hide(); }, 3200);
    }, true);

    window.addEventListener('scroll', hide, {passive:true});
    window.addEventListener('resize', hide);
  }

  function init(){
    try{ renderHeader(); }catch(e){}
    try{ renderFooter(); }catch(e){}
    try{ renderMobileBottom(); }catch(e){}
    try{ initHxTips(); }catch(e){}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
