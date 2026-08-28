/* ============================================================
   SITE CHROME — injects a consistent header + footer on every
   page that includes this script plus <div id="site-header">
   and/or <div id="site-footer"> placeholders.
   ============================================================ */
(function(){
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
    {href:'/packages.html',       label:'Packages'},
    {href:'/explore.html',        label:'Explore Map'},
    {href:'/yui.html',            label:'Route Builder'},
    {href:'/bike-rental.html',    label:'Bike Rental'},
    {href:'/himachal-treks.html', label:'Treks'},
    {href:'/taxi-service.html',   label:'Taxi Service'},
    {href:'/hotels.html',         label:'Hotels'}
  ];

  var FOOT_LINKS = [
    {href:'/index.html',    label:'Home'},
    {href:'/explore.html',  label:'Explore'},
    {href:'/packages.html', label:'Packages'},
    {href:'/yui.html',      label:'Route Builder'},
    {href:'/hotels.html',   label:'Hotels'},
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
      return '<a href="'+l.href+'" class="he-nav-links-item'+active+'"'+current+'>'+l.label+'</a>';
    }).join('');

    var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

    // index.html gets a deliberately simplified header: brand + theme toggle only —
    // no nav rail, phone, or CTA. Every other page gets the full yui.html-style header.
    if(isIndex){
      mount.innerHTML =
        '<header class="he-header he-visible he-header-simple">'+
          '<a href="/index.html" class="he-logo">'+
            '<svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">'+
              '<path d="M2 30L14 12L20 21L25 14L38 30H2Z" fill="#b07d3a"/>'+
              '<path d="M14 12L20 21L17.5 24.5L11 15.5L14 12Z" fill="#6b4415"/>'+
              '<path d="M25 14L38 30H29L23 20.5L25 14Z" fill="#6b4415" opacity=".55"/>'+
            '</svg>'+
            '<span class="he-logo-text">Himachal Explorer<em>Explore · Plan · Experience</em></span>'+
          '</a>'+
          '<div class="he-right">'+
            '<div class="he-seg" role="group" aria-label="Theme">'+
              '<button type="button" id="he-theme-light" class="'+(theme==='light'?'he-active':'')+'">☀ Light</button>'+
              '<button type="button" id="he-theme-dark" class="'+(theme==='dark'?'he-active':'')+'">☾ Dark</button>'+
            '</div>'+
          '</div>'+
        '</header>'+
        '<div class="he-header-spacer" id="he-header-spacer" aria-hidden="true"></div>';

      var lb = document.getElementById('he-theme-light');
      var db = document.getElementById('he-theme-dark');
      function setThemeSimple(next){
        document.documentElement.setAttribute('data-theme', next);
        try{ localStorage.setItem('he-theme', next); }catch(e){}
        if(lb) lb.classList.toggle('he-active', next === 'light');
        if(db) db.classList.toggle('he-active', next === 'dark');
      }
      if(lb) lb.addEventListener('click', function(){ setThemeSimple('light'); });
      if(db) db.addEventListener('click', function(){ setThemeSimple('dark'); });

      var hEl = mount.querySelector('.he-header');
      var sEl = document.getElementById('he-header-spacer');
      var syncSimple = function(){ if(hEl && sEl) sEl.style.height = hEl.getBoundingClientRect().height + 'px'; };
      syncSimple();
      window.addEventListener('resize', syncSimple);
      if(window.ResizeObserver) new ResizeObserver(syncSimple).observe(hEl);
      return;
    }

    // Brand mark + segmented toggle reproduced exactly from yui.html's topbar.
    mount.innerHTML =
      '<header class="he-header he-visible">'+
        '<a href="/index.html" class="he-logo">'+
          '<svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">'+
            '<path d="M2 30L14 12L20 21L25 14L38 30H2Z" fill="#b07d3a"/>'+
            '<path d="M14 12L20 21L17.5 24.5L11 15.5L14 12Z" fill="#6b4415"/>'+
            '<path d="M25 14L38 30H29L23 20.5L25 14Z" fill="#6b4415" opacity=".55"/>'+
          '</svg>'+
          '<span class="he-logo-text">Himachal Explorer<em>Explore · Plan · Experience</em></span>'+
        '</a>'+
        '<nav class="he-nav-links" id="he-nav-links" aria-label="Main navigation">'+linksHTML+'</nav>'+
        '<div class="he-right">'+
          '<div class="he-seg" role="group" aria-label="Theme">'+
            '<button type="button" id="he-theme-light" class="'+(theme==='light'?'he-active':'')+'">☀ Light</button>'+
            '<button type="button" id="he-theme-dark" class="'+(theme==='dark'?'he-active':'')+'">☾ Dark</button>'+
          '</div>'+
          '<a href="tel:+917018138847" class="he-phone">'+
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12.36a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.41 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'+
            '+91-70181 38847'+
          '</a>'+
          '<a href="/packages.html" class="he-cta">Plan Journey</a>'+
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
          '<div class="he-foot-brand">Himachal <em>Explorer</em><span>Explore · Plan · Experience</span></div>'+
          '<ul class="he-foot-links">'+linksHTML+'</ul>'+
          '<div class="he-foot-copy">© 2026 Himachal Explorer · Garg Enterprise · +91-70181 38847</div>'+
        '</div>'+
      '</footer>';
  }

  function init(){
    try{ renderHeader(); }catch(e){}
    try{ renderFooter(); }catch(e){}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
